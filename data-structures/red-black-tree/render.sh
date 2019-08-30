#!/usr/bin/env bash

rm -f *.dot *.svg

node index.js

function render_to_html() {
    echo '
    <!DOCTYPE html>
    <html>
        <head>
            <title>Nodes</title>
        </head>
        <body>
    '
    
    i=0
    for dotf in *.dot
    do
        echo '<span style="border: 1px solid black; display: inline-block">'
        echo '<h3>'$i'</h3>'
        dot -T svg "$dotf"
        echo '</span>'
        i=$((i + 1))
    done
    
    echo '
        </body>
    </html>
    '
}

render_to_html > index.html
