# call me from parent dir!

jade $(pwd)/*.jade
stylus -c $(pwd)/static/css/style.styl
uglifyjs $(pwd)/static/js/main.js --output $(pwd)/static/js/main.min.js