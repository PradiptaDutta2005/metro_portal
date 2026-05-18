#!/bin/sh
# Start celery worker and beat in same container (for small infra). For production prefer separate containers.
celery -A job_distributor.celery_app.celery worker --loglevel=info -Q job_distributor -n worker.%h &
celery -A job_distributor.celery_app.celery beat --loglevel=info &
wait
