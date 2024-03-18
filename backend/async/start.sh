#!/bin/bash
hypercorn fastapi_app:app --config hypercorn_config.toml
