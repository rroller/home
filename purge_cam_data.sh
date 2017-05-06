#!/usr/bin/env bash
# Deletes vidoes older than n days and remove empty directories
find /mnt/user/cams -type f -mtime +7 ! -name 'DVRWorkDirectory' -delete
find /mnt/user/cams -type d -empty -delete
