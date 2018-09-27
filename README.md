# slinker.io
Smart Linker www.slinker.link


## Requirements

* AWS CLI already configured with at least PowerUser permission
* [NodeJS 8.10+ installed](https://nodejs.org/en/download/)
* [Docker installed](https://www.docker.com/community-edition)
* Should have downloaded https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.DownloadingAndRunning.html and running for local tests
* Should have created a unit test profile for AWS CLI ``aws configure --profile unit_test``


## Setup process

### Installing dependencies


```bash
cd slinker_serverless
npm install
cd ../
```

### Local Testing

Start the local DynamoDB install.
```bash
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

then run the unit tests
```bash
npm test
```

### Local development

**Invoking function locally through local API Gateway**

```bash
sam local start-api
```

If the previous command ran successfully you should now be able to hit the following local endpoint to invoke your function `http://localhost:3000/slink/myuniqueid`

**SAM CLI** is used to emulate both Lambda and API Gateway locally and uses our `template.yaml` to understand how to bootstrap this environment (runtime, where the source code is, etc.) - The following excerpt is what the CLI will read in order to initialize an API and its routes:

```yaml
...
      Events:
        CreateSlink:
          Type: Api # More info about API Event Source: https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md#api
          Properties:
            Path: /slink/{uid}
            Method: get
```

### Deployment
The backend application components (Lambda, DynamoDB and API gateway) are packaged and deployed using codepipeline and SAM templates (``sam_template.yaml``). 
The static website part (``index.html``, ``.well-known/assetlinks.json`` etc) are hosted in public S3 buckets.
A Cloudfront distribution is used to send requests to ``https://www.slinker.link/index.html`` to the the S3 bucket, while requests to ``https://api.slinker.link/slink/*`` will 
go to the API gateway and be serviced by the Lambda functions.