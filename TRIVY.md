# TRIVY Sample Commands 


- Image Scan Sample 

```bash
trivy image --scanners vuln,config,secret --severity HIGH,CRITICAL vibhuvi-session-ng

# CycloneDX format 

trivy image --scanners vuln,config,secret --severity HIGH,CRITICAL --format cyclonedx  --output application_config_scan_report.xml vibhuvi-session-ng
```

- Filesystem scan Sample 

```bash
trivy fs --scanners vuln,config,secret --severity HIGH,CRITICAL application/

# CycloneDX format 
trivy fs --scanners vuln,config,secret --severity HIGH,CRITICAL  --format cyclonedx  --output application_filesystem_report.xml application/
```
