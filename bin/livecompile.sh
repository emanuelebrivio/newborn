# call me from parent dir!

static -H '{"Cache-Control": "no-cache, must-revalidate"}' --port 3001 &
nodemon --exec "sh $(pwd)/bin/build.sh" -e jade,styl,js --ignore "$(pwd)/js/main.min.js" --watch "$(pwd)" --watch "$(pwd)/**/*"
