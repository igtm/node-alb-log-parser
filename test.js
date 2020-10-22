var tap = require('tap')

var parse = require('./index.js')

tap.test('http traffic', function (t) {
  var parsed = parse(
    'http 2015-05-13T23:39:43.945958Z my-loadbalancer 192.168.131.39:2817 10.0.0.1:80 0.000073 0.001048 0.000057 200 200 0 29 "GET http://www.example.com:80/ HTTP/1.1" "curl/7.38.0" - - arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337262-36d228ad5d99923122bbe354"'
  )
  t.equal(parsed.type, 'http', 'we have type')
  t.equal(parsed.timestamp, '2015-05-13T23:39:43.945958Z', 'we have timestamp')
  t.equal(parsed.elb, 'my-loadbalancer', 'we have ELB')
  t.equal(parsed.client, '192.168.131.39', 'we have client')
  t.equal(parsed.client_port, 2817, 'we have client_port')
  t.equal(parsed.target, '10.0.0.1', 'we have target')
  t.equal(parsed.target_port, 80, 'we have target_port')
  t.equal(
    parsed.request_processing_time,
    0.000073,
    'we have request_processing_time'
  )
  t.equal(
    parsed.target_processing_time,
    0.001048,
    'we have target_processing_time'
  )
  t.equal(
    parsed.response_processing_time,
    0.000057,
    'we have response_processing_time'
  )
  t.equal(parsed.elb_status_code, 200, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 200, 'we have target_status_code')
  t.equal(parsed.received_bytes, 0, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 29, 'we have sent_bytes')
  t.equal(
    parsed.request,
    'GET http://www.example.com:80/ HTTP/1.1',
    'we have request'
  )
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(
    parsed.request_uri,
    'http://www.example.com:80/',
    'we have request_uri'
  )
  t.equal(
    parsed.request_http_version,
    'HTTP/1.1',
    'we have request_http_version'
  )
  t.equal(parsed.request_uri_scheme, 'http', 'we have request_uri_scheme')
  t.equal(
    parsed.request_uri_host,
    'www.example.com',
    'we have request_uri_host'
  )
  t.equal(parsed.request_uri_port, 80, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.equal(parsed.user_agent, 'curl/7.38.0', 'we have user_anget')
  t.equal(parsed.ssl_cipher, '-', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, '-', 'we have ssl_protocol')
  t.equal(
    parsed.target_group_arn,
    'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067',
    'we have target_group_arn'
  )
  t.equal(
    parsed.trace_id,
    'Root=1-58337262-36d228ad5d99923122bbe354',
    'we have trace_id'
  )
  t.end()
})

tap.test('https traffic', function (t) {
  var parsed = parse(
    'https    2018-07-02T22:23:00.186641Z app/my-loadbalancer/50dc6c495c0c9188 192.168.131.39:2817 10.0.0.1:80 0.086 0.048 0.037 200 200 0 57 "GET https://www.example.com:443/ HTTP/1.1" "curl/7.46.0" ECDHE-RSA-AES128-GCM-SHA256 TLSv1.2 arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337281-1d84f3d73c47ec4e58577259" "www.example.com" "arn:aws:acm:us-east-2:123456789012:certificate/12345678-1234-1234-1234-123456789012"1 2018-07-02T22:22:48.364000Z "authenticate,forward" "-" "-"'
  )
  t.equal(parsed.type, 'https', 'we have type')
  t.equal(parsed.timestamp, '2018-07-02T22:23:00.186641Z', 'we have timestamp')
  t.equal(parsed.elb, 'app/my-loadbalancer/50dc6c495c0c9188', 'we have elb')
  t.equal(parsed.client, '192.168.131.39', 'we have client')
  t.equal(parsed.client_port, 2817, 'we have client_port')
  t.equal(parsed.target, '10.0.0.1', 'we have target')
  t.equal(parsed.request_processing_time, 0.086, 'we have request_processing_time')
  t.equal(parsed.target_processing_time, 0.048, 'we have target_processing_time')
  t.equal(parsed.response_processing_time, 0.037, 'we have response_processing_time')
  t.equal(parsed.elb_status_code, 200, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 200, 'we have target_status_code')
  t.equal(parsed.received_bytes, 0, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 57, 'we have sent_bytes')
  t.equal(parsed.request, 'GET https://www.example.com:443/ HTTP/1.1', 'we have request')
  t.equal(parsed.user_agent, 'curl/7.46.0', 'we have user_agent')
  t.equal(parsed.ssl_cipher, 'ECDHE-RSA-AES128-GCM-SHA256', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, 'TLSv1.2', 'we have ssl_protocol')
  t.equal(parsed.target_group_arn, 'arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067', 'we have target_group_arn')
  t.equal(parsed.trace_id, 'Root=1-58337281-1d84f3d73c47ec4e58577259', 'we have trace_id')
  t.equal(parsed.domain_name, 'www.example.com', 'we have domain_name')
  t.equal(parsed.chosen_cert_arn, 'arn:aws:acm:us-east-2:123456789012:certificate/12345678-1234-1234-1234-123456789012', 'we have chosen_cert_arn')
  t.equal(parsed.target_port, 80, 'we have target_port')
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(parsed.request_uri, 'https://www.example.com:443/', 'we have request_uri')
  t.equal(parsed.request_http_version, 'HTTP/1.1', 'we have request_http_version')
  t.equal(parsed.request_uri_scheme, 'https', 'we have request_uri_scheme')
  t.equal(parsed.request_uri_host, 'www.example.com', 'we have request_uri_host')
  t.equal(parsed.request_uri_port, 443, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.end()
})

tap.test('https traffic', function (t) {
  var parsed = parse(
    'https 2015-05-13T23:39:43.945958Z my-loadbalancer 192.168.131.39:2817 10.0.0.1:80 0.000086 0.001048 0.001337 200 200 0 57 "GET https://mytest-111.ap-northeast-1.elb.amazonaws.com:443/p/a/t/h?foo=bar&hoge=fuga HTTP/1.1" "curl/7.38.0" DHE-RSA-AES128-SHA TLSv1.2 arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337262-36d228ad5d99923122bbe354"'
  )
  t.equal(parsed.timestamp, '2015-05-13T23:39:43.945958Z', 'we have timestamp')
  t.equal(parsed.elb, 'my-loadbalancer', 'we have ELB')
  t.equal(parsed.client, '192.168.131.39', 'we have client')
  t.equal(parsed.client_port, 2817, 'we have client_port')
  t.equal(parsed.target, '10.0.0.1', 'we have target')
  t.equal(parsed.target_port, 80, 'we have target_port')
  t.equal(
    parsed.request_processing_time,
    0.000086,
    'we have request_processing_time'
  )
  t.equal(
    parsed.target_processing_time,
    0.001048,
    'we have target_processing_time'
  )
  t.equal(
    parsed.response_processing_time,
    0.001337,
    'we have response_processing_time'
  )
  t.equal(parsed.elb_status_code, 200, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 200, 'we have target_status_code')
  t.equal(parsed.received_bytes, 0, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 57, 'we have sent_bytes')
  t.equal(
    parsed.request,
    'GET https://mytest-111.ap-northeast-1.elb.amazonaws.com:443/p/a/t/h?foo=bar&hoge=fuga HTTP/1.1',
    'we have request'
  )
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(
    parsed.request_uri,
    'https://mytest-111.ap-northeast-1.elb.amazonaws.com:443/p/a/t/h?foo=bar&hoge=fuga',
    'we have request_uri'
  )
  t.equal(
    parsed.request_http_version,
    'HTTP/1.1',
    'we have request_http_version'
  )
  t.equal(parsed.request_uri_scheme, 'https', 'we have request_uri_scheme')
  t.equal(
    parsed.request_uri_host,
    'mytest-111.ap-northeast-1.elb.amazonaws.com',
    'we have request_uri_host'
  )
  t.equal(parsed.request_uri_port, 443, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/p/a/t/h', 'we have request_uri_path')
  t.equal(
    parsed.request_uri_query,
    'foo=bar&hoge=fuga',
    'we have request_uri_query'
  )
  t.equal(parsed.user_agent, 'curl/7.38.0', 'we have user_anget')
  t.equal(parsed.ssl_cipher, 'DHE-RSA-AES128-SHA', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, 'TLSv1.2', 'we have ssl_protocol')
  t.end()
})

tap.test('tcp traffic', function (t) {
  var parsed = parse(
    'http 2015-05-13T23:39:43.945958Z my-loadbalancer 192.168.131.39:2817 10.0.0.1:80 0.001069 0.000028 0.000041 - - 82 305 "- - - " "-" - - arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337262-36d228ad5d99923122bbe354"'
  )
  t.equal(parsed.request, '- - - ', 'we have request')
  t.equal(parsed.user_agent, '-', 'we have user_anget')
  t.end()
})

tap.test('ssl traffic', function (t) {
  var parsed = parse(
    'https 2015-05-13T23:39:43.945958Z my-loadbalancer 192.168.131.39:2817 10.0.0.1:80 0.001065 0.000015 0.000023 - - 57 502 "- - - " "-" ECDHE-ECDSA-AES128-GCM-SHA256 TLSv1.2 arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337262-36d228ad5d99923122bbe354"'
  )
  t.equal(
    parsed.ssl_cipher,
    'ECDHE-ECDSA-AES128-GCM-SHA256',
    'we have ssl_cipher'
  )
  t.equal(parsed.ssl_protocol, 'TLSv1.2', 'we have ssl_protocol')
  t.end()
})

tap.test("doesn't receive traffic ", function (t) {
  var parsed = parse(
    'http 2015-05-13T23:39:43.945958Z my-loadbalancer 192.168.131.39:2817 -1 0.001065 0.000015 0.000023 - - 57 502 "- - - " "-" ECDHE-ECDSA-AES128-GCM-SHA256 TLSv1.2 arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337262-36d228ad5d99923122bbe354"'
  )
  t.equal(parsed.target, -1, 'we have target')
  t.equal(parsed.target_port, -1, 'we have target_port')
  t.end()
})

tap.test('websockets', function (t) {
  var parsed = parse(
    'ws 2018-07-02T22:23:00.186641Z app/my-loadbalancer/50dc6c495c0c9188 10.0.0.140:40914 10.0.1.192:8010 0.001 0.003 0.000 101 101 218 587 "GET http://10.0.0.30:80/ HTTP/1.1" "-" - - arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337364-23a8c76965a2ef7629b185e3" "-" "-" 1 2018-07-02T22:22:48.364000Z "forward" "-" "-"'
  )
  t.equal(parsed.type, 'ws', 'we have type')
  t.equal(parsed.timestamp, '2018-07-02T22:23:00.186641Z', 'we have timestamp')
  t.equal(parsed.elb, 'app/my-loadbalancer/50dc6c495c0c9188', 'we have elb')
  t.equal(parsed.client, '10.0.0.140', 'we have client')
  t.equal(parsed.client_port, 40914, 'we have client_port')
  t.equal(parsed.target, '10.0.1.192', 'we have target')
  t.equal(
    parsed.request_processing_time,
    0.001,
    'we have request_processing_time'
  )
  t.equal(
    parsed.target_processing_time,
    0.003,
    'we have target_processing_time'
  )
  t.equal(
    parsed.response_processing_time,
    0,
    'we have response_processing_time'
  )
  t.equal(parsed.elb_status_code, 101, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 101, 'we have target_status_code')
  t.equal(parsed.received_bytes, 218, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 587, 'we have sent_bytes')
  t.equal(
    parsed.request,
    'GET http://10.0.0.30:80/ HTTP/1.1',
    'we have request'
  )
  t.equal(parsed.user_agent, '-', 'we have user_agent')
  t.equal(parsed.ssl_cipher, '-', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, '-', 'we have ssl_protocol')
  t.equal(
    parsed.target_group_arn,
    'arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067',
    'we have target_group_arn'
  )
  t.equal(
    parsed.trace_id,
    'Root=1-58337364-23a8c76965a2ef7629b185e3',
    'we have trace_id'
  )
  t.equal(parsed.target_port, 8010, 'we have target_port')
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(parsed.request_uri, 'http://10.0.0.30:80/', 'we have request_uri')
  t.equal(
    parsed.request_http_version,
    'HTTP/1.1',
    'we have request_http_version'
  )
  t.equal(parsed.request_uri_scheme, 'http', 'we have request_uri_scheme')
  t.equal(parsed.request_uri_host, '10.0.0.30', 'we have request_uri_host')
  t.equal(parsed.request_uri_port, 80, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.end()
})

tap.test('secure websockets', function (t) {
  var parsed = parse(
    'wss 2018-07-02T22:23:00.186641Z app/my-loadbalancer/50dc6c495c0c9188 10.0.0.140:44244 10.0.0.171:8010 0.000 0.001 0.000 101 101 218 786 "GET https://10.0.0.30:443/ HTTP/1.1" "-" ECDHE-RSA-AES128-GCM-SHA256 TLSv1.2 arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337364-23a8c76965a2ef7629b185e3" "-" "-" 1 2018-07-02T22:22:48.364000Z "forward" "-" "-"'
  )
  t.equal(parsed.type, 'wss', 'we have type')
  t.equal(parsed.timestamp, '2018-07-02T22:23:00.186641Z', 'we have timestamp')
  t.equal(parsed.elb, 'app/my-loadbalancer/50dc6c495c0c9188', 'we have elb')
  t.equal(parsed.client, '10.0.0.140', 'we have client')
  t.equal(parsed.client_port, 44244, 'we have client_port')
  t.equal(parsed.target, '10.0.0.171', 'we have target')
  t.equal(parsed.request_processing_time, 0, 'we have request_processing_time')
  t.equal(parsed.target_processing_time, 0.001, 'we have target_processing_time')
  t.equal(parsed.response_processing_time, 0, 'we have response_processing_time')
  t.equal(parsed.elb_status_code, 101, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 101, 'we have target_status_code')
  t.equal(parsed.received_bytes, 218, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 786, 'we have sent_bytes')
  t.equal(parsed.request, 'GET https://10.0.0.30:443/ HTTP/1.1', 'we have request')
  t.equal(parsed.user_agent, '-', 'we have user_agent')
  t.equal(parsed.ssl_cipher, 'ECDHE-RSA-AES128-GCM-SHA256', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, 'TLSv1.2', 'we have ssl_protocol')
  t.equal(parsed.target_group_arn, 'arn:aws:elasticloadbalancing:us-west-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067', 'we have target_group_arn')
  t.equal(parsed.trace_id, 'Root=1-58337364-23a8c76965a2ef7629b185e3', 'we have trace_id')
  t.equal(parsed.target_port, 8010, 'we have target_port')
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(parsed.request_uri, 'https://10.0.0.30:443/', 'we have request_uri')
  t.equal(parsed.request_http_version, 'HTTP/1.1', 'we have request_http_version')
  t.equal(parsed.request_uri_scheme, 'https', 'we have request_uri_scheme')
  t.equal(parsed.request_uri_host, '10.0.0.30', 'we have request_uri_host')
  t.equal(parsed.request_uri_port, 443, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.equal(parsed.chosen_cert_arn, '-', 'we have chosen_cert_arn')
  t.end()
})

tap.test('unsuccessful Lambda', function (t) {
  var parsed = parse(
    'http 2018-11-30T22:23:00.186641Z app/my-loadbalancer/50dc6c495c0c9188 192.168.131.39:2817 - 0.000 0.001 0.000 502 - 34 366 "GET http://www.example.com:80/ HTTP/1.1" "curl/7.46.0" - - arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337364-23a8c76965a2ef7629b185e3" "-" "-" 0 2018-11-30T22:22:48.364000Z "forward" "-" "LambdaInvalidResponse"'
  )
  t.equal(parsed.type, 'http', 'we have type')
  t.equal(parsed.timestamp, '2018-11-30T22:23:00.186641Z', 'we have timestamp')
  t.equal(parsed.elb, 'app/my-loadbalancer/50dc6c495c0c9188', 'we have elb')
  t.equal(parsed.client, '192.168.131.39', 'we have client')
  t.equal(parsed.client_port, 2817, 'we have client_port')
  t.equal(parsed.target, '-', 'we have target')
  t.equal(parsed.target_port, -1, 'we have target_port')
  t.equal(parsed.request_processing_time, 0, 'we have request_processing_time')
  t.equal(parsed.target_processing_time, 0.001, 'we have target_processing_time')
  t.equal(parsed.response_processing_time, 0, 'we have response_processing_time')
  t.equal(parsed.elb_status_code, 502, 'we have elb_status_code')
  t.equal(parsed.target_status_code, '-', 'we have target_status_code')
  t.equal(parsed.received_bytes, 34, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 366, 'we have sent_bytes')
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(parsed.request_uri, 'http://www.example.com:80/', 'we have request_uri')
  t.equal(parsed.request_http_version, 'HTTP/1.1', 'we have request_http_version')
  t.equal(parsed.request_uri_scheme, 'http', 'we have request_uri_scheme')
  t.equal(parsed.request_uri_host, 'www.example.com', 'we have request_uri_host')
  t.equal(parsed.request_uri_port, 80, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.equal(parsed.request, 'GET http://www.example.com:80/ HTTP/1.1', 'we have request')
  t.equal(parsed.user_agent, 'curl/7.46.0', 'we have user_agent')
  t.equal(parsed.ssl_cipher, '-', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, '-', 'we have ssl_protocol')
  t.equal(parsed.target_group_arn, 'arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067', 'we have target_group_arn')
  t.equal(parsed.trace_id, 'Root=1-58337364-23a8c76965a2ef7629b185e3', 'we have trace_id')
  t.equal(parsed.domain_name, '-', 'we have domain_name')
  t.equal(parsed.chosen_cert_arn, '-', 'we have chosen_cert_arn')
  t.equal(parsed.matched_rule_priority, 0, 'we have matched_rule_priority')
  t.equal(parsed.request_creation_time, '2018-11-30T22:22:48.364000Z', 'we have request_creation_time')
  t.equal(parsed.actions_executed, 'forward', 'we have actions_executed')
  t.equal(parsed.redirect_url, '-', 'we have redirect_url')
  t.equal(parsed.error_reason, 'LambdaInvalidResponse', 'we have error_reason')
  t.end()
})

tap.test('successful Lambda', function (t) {
  var parsed = parse(
    'http 2018-11-30T22:23:00.186641Z app/my-loadbalancer/50dc6c495c0c9188 192.168.131.39:2817 - 0.000 0.001 0.000 200 200 34 366 "GET http://www.example.com:80/ HTTP/1.1" "curl/7.46.0" - - arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067 "Root=1-58337364-23a8c76965a2ef7629b185e3" "-" "-" 0 2018-11-30T22:22:48.364000Z "forward" "-" "-"'
  )
  t.equal(parsed.type, 'http', 'we have type')
  t.equal(parsed.timestamp, '2018-11-30T22:23:00.186641Z', 'we have timestamp')
  t.equal(parsed.elb, 'app/my-loadbalancer/50dc6c495c0c9188', 'we have elb')
  t.equal(parsed.client, '192.168.131.39', 'we have client')
  t.equal(parsed.client_port, 2817, 'we have client_port')
  t.equal(parsed.target, '-', 'we have target')
  t.equal(parsed.target_port, -1, 'we have target_port')
  t.equal(parsed.request_processing_time, 0, 'we have request_processing_time')
  t.equal(parsed.target_processing_time, 0.001, 'we have target_processing_time')
  t.equal(parsed.response_processing_time, 0, 'we have response_processing_time')
  t.equal(parsed.elb_status_code, 200, 'we have elb_status_code')
  t.equal(parsed.target_status_code, 200, 'we have target_status_code')
  t.equal(parsed.received_bytes, 34, 'we have received_bytes')
  t.equal(parsed.sent_bytes, 366, 'we have sent_bytes')
  t.equal(parsed.request_method, 'GET', 'we have request_method')
  t.equal(parsed.request_uri, 'http://www.example.com:80/', 'we have request_uri')
  t.equal(parsed.request_http_version, 'HTTP/1.1', 'we have request_http_version')
  t.equal(parsed.request_uri_scheme, 'http', 'we have request_uri_scheme')
  t.equal(parsed.request_uri_host, 'www.example.com', 'we have request_uri_host')
  t.equal(parsed.request_uri_port, 80, 'we have request_uri_port')
  t.equal(parsed.request_uri_path, '/', 'we have request_uri_path')
  t.equal(parsed.request_uri_query, null, 'we have request_uri_query')
  t.equal(parsed.request, 'GET http://www.example.com:80/ HTTP/1.1', 'we have request')
  t.equal(parsed.user_agent, 'curl/7.46.0', 'we have user_agent')
  t.equal(parsed.ssl_cipher, '-', 'we have ssl_cipher')
  t.equal(parsed.ssl_protocol, '-', 'we have ssl_protocol')
  t.equal(parsed.target_group_arn, 'arn:aws:elasticloadbalancing:us-east-2:123456789012:targetgroup/my-targets/73e2d6bc24d8a067', 'we have target_group_arn')
  t.equal(parsed.trace_id, 'Root=1-58337364-23a8c76965a2ef7629b185e3', 'we have trace_id')
  t.equal(parsed.domain_name, '-', 'we have domain_name')
  t.equal(parsed.chosen_cert_arn, '-', 'we have chosen_cert_arn')
  t.equal(parsed.matched_rule_priority, 0, 'we have matched_rule_priority')
  t.equal(parsed.request_creation_time, '2018-11-30T22:22:48.364000Z', 'we have request_creation_time')
  t.equal(parsed.actions_executed, 'forward', 'we have actions_executed')
  t.equal(parsed.redirect_url, '-', 'we have redirect_url')
  t.equal(parsed.error_reason, '-', 'we have error_reason')
  t.end()
})

tap.test('classification and classification reason', function(t) {
	var parsed = parse('http 2020-08-27T16:35:00.166351Z app/my-loadbalancer/50dc6c495c0c9188 192.168.131.39:2817 192.168.201.251:80 0.000 0.440 0.000 200 200 1107 11912 "GET http://example.com:80/path?foo=bar&baz=bak HTTP/1.1" "Fake/1.0.0 (Linux)" - - arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-tg/ffffffffffffffff "Self=1-00000000-111111111111111111111111;Root=1-00000000-222222222222222222222222" "-" "-" 0 2020-08-27T16:34:59.725000Z "forward" "-" "-" "192.168.201.251:80" "200" "-" "-"')
  t.equal(parsed.classification, '-', 'we have classification')
  t.equal(parsed.classification_reason, '-', 'we have classification_reason')
	t.end()
})

tap.test('extra fields are ignored', function(t) {
	var parsed = parse('http 2020-08-27T16:35:00.166351Z app/my-loadbalancer/50dc6c495c0c9188 192.168.131.39:2817 192.168.201.251:80 0.000 0.440 0.000 200 200 1107 11912 "GET http://example.com:80/path?foo=bar&baz=bak HTTP/1.1" "Fake/1.0.0 (Linux)" - - arn:aws:elasticloadbalancing:us-east-1:123456789012:targetgroup/my-tg/ffffffffffffffff "Self=1-00000000-111111111111111111111111;Root=1-00000000-222222222222222222222222" "-" "-" 0 2020-08-27T16:34:59.725000Z "forward" "-" "-" "192.168.201.251:80" "200" "-" "-" "FOO BAR" BAZ')
  const seen = Object.values(parsed).filter(val => (val === 'FOO BAR' || val === 'BAZ'))
  t.equal(seen.length, 0, 'Extra fields are ignored')
	t.end()
})
