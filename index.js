#! /usr/bin/env node
var Path = require('path-parser').default;
var parser = class albLogParser
{

  constructor(option = {pathParams: []}) {
    this.pathParams = option.pathParams
  }

  parse (line) {

    var url = require('url');
    var parsed = {};

    var request_labels = 
    [
      'request_method',
      'request_uri',
      'request_http_version',
      'request_uri_scheme',
      'request_uri_host',
      'request_uri_port',
      'request_uri_path',
      'request_uri_query',
      'request_uri_path_param'
    ];

    //
    // Trailing newline? NOTHX
    //
    if (line.match(/\n$/)) {
      line = line.slice(0, line.length - 1);
    }

    [
      { 'type'                        : ' '   },
      { 'timestamp'                   : ' '   },
      { 'elb'                         : ' '   },
      { 'client'                      : ':'   },
      { 'client_port'                 : ' '   },
      { 'target'                      : ' '   },
      { 'request_processing_time'     : ' '   },
      { 'target_processing_time'      : ' '   },
      { 'response_processing_time'    : ' '   },
      { 'elb_status_code'             : ' '   },
      { 'target_status_code'          : ' '   },
      { 'received_bytes'              : ' '   },
      { 'sent_bytes'                  : ' "'  },
      { 'request'                     : '" "' },
      { 'user_agent'                  : '" '  },
      { 'ssl_cipher'                  : ' '   },
      { 'ssl_protocol'                : ' '   },
      { 'target_group_arn'            : ' "'   },
      { 'trace_id'                    : '"'   }
    ].some(function (t) {
      var label = Object.keys(t)[0];
      var delimiter = t[label]
      var m = line.match(delimiter);
      if (m === null) {
        //
        // No match. Try to pick off the last element.
        //
        m = line.match(delimiter.slice(0, 1));

        var field = null
        if (m === null) {
          field = line;
        }
        else {
          field = line.substr(0, m.index);
        }
        parsed[label] = field;

        return true;
      }
      field = line.substr(0, m.index);
      line = line.substr(m.index + delimiter.length);
      parsed[label] = field == 0 ? 0 : Number(field) || field;
    });

    // target
    if(parsed.target != -1) {
      parsed['target_port'] = parseInt(parsed.target.split(":")[1]);
      parsed['target'] = parsed.target.split(":")[0];
    } else {
      parsed['target_port'] = -1;
    }

    // request
    if(parsed.request != '- - - ') {
      var i = 0;
      var method = parsed.request.split(" ")[0];
      var url = url.parse(parsed.request.split(" ")[1]);
      var http_version = parsed.request.split(" ")[2];

      parsed[request_labels[i++]] = method;
      parsed[request_labels[i++]] = url.href;
      parsed[request_labels[i++]] = http_version;
      parsed[request_labels[i++]] = url.protocol;
      parsed[request_labels[i++]] = url.hostname;
      parsed[request_labels[i++]] = parseInt(url.port);
      parsed[request_labels[i++]] = url.pathname;
      parsed[request_labels[i++]] = url.query;
      parsed[request_labels[i++]] = this.parsePathParam(method, url.pathname);

    } else {
      request_labels.forEach(function(label) {
        parsed[label] = '-';
      });
    }

    return parsed;
  };

  parsePathParam(method, path) {
    for(const obj in this.pathParams) {
      var pathParser = new Path(this.pathParams[obj].path);
      var param = pathParser.test(path)
      if (method === this.pathParams[obj].method && param.value) {
        return param.value
      }
    }

    return ""
  }
}

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

module.exports = parser