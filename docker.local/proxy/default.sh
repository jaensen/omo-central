SET_HEADER_BLOCK=`cat << 'EOF'
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header Host $http_host;
    proxy_set_header Cookie $http_cookie;
EOF`

RATE_LIMITING=`cat << 'EOF'
limit_req_zone $binary_remote_addr zone=zone1:10m rate=2r/s;
limit_req_zone $binary_remote_addr zone=zone2:10m rate=4r/s;
limit_req_zone $binary_remote_addr zone=zone3:10m rate=8r/s;
EOF`

TEMPLATE=`cat << EOF
$RATE_LIMITING

server {
  server_name omo.local;

  listen ${PROXY_PORT};

  location /${PROXY_SERVICE_STATIC_PATH} {
$SET_HEADER_BLOCK
    proxy_pass ${STATIC_PROTOCOL}${STATIC_DOMAIN}:${STATIC_PORT};
  }

  location /${PROXY_SERVICE_AUTH_PATH} {
    limit_req zone=zone1 burst=6 nodelay;
$SET_HEADER_BLOCK
    proxy_pass ${AUTH_PROTOCOL}${AUTH_DOMAIN}:${AUTH_PORT};
  }

  location /${PROXY_SERVICE_IDENTITY_PATH} {
    limit_req zone=zone2 burst=16 nodelay;
$SET_HEADER_BLOCK
    proxy_pass ${IDENTITY_PROTOCOL}${IDENTITY_DOMAIN}:${IDENTITY_PORT};
  }

  location /${PROXY_SERVICE_SAFE_PATH} {
    limit_req zone=zone2 burst=16 nodelay;
$SET_HEADER_BLOCK
    proxy_pass ${SAFE_PROTOCOL}${SAFE_DOMAIN}:${SAFE_PORT};
  }

  location /${PROXY_SERVICE_MARKETPLACE_PATH} {
    limit_req zone=zone3 burst=25 nodelay;
$SET_HEADER_BLOCK
    proxy_pass ${MARKETPLACE_PROTOCOL}${MARKETPLACE_DOMAIN}:${MARKETPLACE_PORT};
  }

#  location /${PROXY_SERVICE_APP_PATH} {
# SET_HEADER_BLOCK
#    proxy_pass ${APP_PROTOCOL}${APP_DOMAIN}:${APP_PORT};
#  }
}
EOF`
echo "$TEMPLATE" > default.conf
