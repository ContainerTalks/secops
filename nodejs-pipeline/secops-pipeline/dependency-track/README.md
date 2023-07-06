# Dependency Track 

## API Integration

```bash
curl -X "POST" "http://localhost:8081/api/v1/bom" \
     -H 'Content-Type: multipart/form-data' \
     -H "X-Api-Key: Evc5g3oOVGqXtVMJrQKUvCEck81DwHen" \
     -F "autoCreate=true" \
     -F "projectName=SampleAppOne" \
     -F "projectVersion=01.SNAPSHOT" \
     -F "parentName=SampleParent" \
     -F "parentVersion=01.SNAPSHOT" \
     -F "bom=./result.json"
```


```bash
curl -X "PUT" "http://localhost:8081/api/v1/bom" \
     -H 'Content-Type: application/json' \
     -H 'X-API-Key: Evc5g3oOVGqXtVMJrQKUvCEck81DwHen' \
     -d '{
        "autoCreate": true,
        "projectName": "SampleAppOne",
        "projectVersion": "01.SNAPSHOT",
        "bom": "@target/result.json"
     }'
```