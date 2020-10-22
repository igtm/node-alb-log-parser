#! /usr/bin/env node

/**
 * Field names, in order of appearance in the ALB log lines
 */
const fields = [
  'type',                   'timestamp',                'elb',                      'client:port',
  'target:port',            'request_processing_time',  'target_processing_time',   'response_processing_time',
  'elb_status_code',        'target_status_code',       'received_bytes',           'sent_bytes',
  'request',                'user_agent',               'ssl_cipher',               'ssl_protocol',
  'target_group_arn',       'trace_id',                 'domain_name',              'chosen_cert_arn',
  'matched_rule_priority',  'request_creation_time',    'actions_executed',         'redirect_url',
  'error_reason',           'target_port_list',         'target_status_code_list',  'classification',
  'classification_reason'
]
module.exports = function (line) {
  //
  // Trailing newline? NOTHX
  //
  if (line.match(/\n$/)) {
    line = line.slice(0, line.length - 1);
  }

  const parsed = parseAlbLogLine(line)
  return parsed
};

if (require.main === module) {
  var split = require('split');
  var Transform = require('stream').Transform;
  process.stdin
    .pipe(split())
    .pipe(new Transform({
      decodeStrings: false,
      transform: function (line, encoding, callback) {
        if (line) {
          this.push(JSON.stringify(module.exports(line)) + '\n');
        }
        callback();
      }
    }))
    .pipe(process.stdout);
}

/**
 * Parse one line of an AWS Application Load Balancer log
 *
 * @param {string} line
 */
function parseAlbLogLine(line) {
  const parsed = {}
  let counter = 0
  let finished = false
  let quoteSeen = false
  let element = ''
  for (const c of line + '  ') {
    if (finished) {
      if (element) {

        let fieldName = fields[counter]
        // Convert all numeric strings to numbers
        if (element.match(/^\d+.?\d*$/)) {
          element = Number(element)
        }
        if (fieldName === 'request') {
          _decorateFromRequest(element, parsed)
        }

        // H/T @jason-linthwaite (https://github.com/jason-linthwaite)
        if (!fieldName) continue

        if (fieldName.match(/^\S+?:port$/)) {
          _decorateFromPortField(fieldName, element, parsed)
        } else {
          parsed[fieldName] = element
        }

        element = ''
        counter++
      }
      finished = false
    }

    // treat whitespace as a delimiter *except* when inside of quotes
    if (c.match(/^\s$/) && !quoteSeen) finished = true

    if (c === '"') { // beginning or end of a quote delimited string
      if (quoteSeen) finished = true // if we've seen one quote, this closes the quote delimited string
      quoteSeen = !quoteSeen // Toggle the quote flag
    } else {
      // Append the character to the element unless this character terminates the element
      if (!finished) element += c
    }
  }
  return parsed
}

function _decorateFromPortField(fieldName, element, parsed) {
  // We don't actually send back 'client:port' and 'target:port'; we send back
  // 'client', 'client_port', 'target', and 'target_port'
  const field = fieldName.match(/^(\S+?):port/)[1]
  const [ip, port] = element.split(':')
  if (ip === '-1') {
    parsed[field] = parseInt(ip)
  } else {
    parsed[field] = ip
  }
  if (port) {
    parsed[`${field}_port`] = parseInt(port)
  } else {
    parsed[`${field}_port`] = -1
  }
  return parsed
}
/**
 * Helper for parseAlbLogLine
 *
 * @param {string} element
 * @param {object} parsed
 */
function _decorateFromRequest(element, parsed) {
  const url = require('url');
  const [request_method, request_uri, request_http_version] = element.split(/\s+/)
  parsed.request_method = request_method
  parsed.request_uri = request_uri
  parsed.request_http_version = request_http_version
  const parsedUrl = url.parse(request_uri)
  parsed.request_uri_scheme = parsedUrl.protocol.replace(':', '')
  parsed.request_uri_host = parsedUrl.hostname
  if (parsedUrl.port) {
    parsed.request_uri_port = parseInt(parsedUrl.port)
  }
  parsed.request_uri_path = parsedUrl.pathname
  parsed.request_uri_query = parsedUrl.query
  return parsed
}
