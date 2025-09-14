#!/bin/sh
# Simple PHP dev server for forms
ROOT_DIR="HTML_TEMPLATE"
HOST="127.0.0.1"
PORT="8000"
php -S "$HOST:$PORT" -t "$ROOT_DIR"
