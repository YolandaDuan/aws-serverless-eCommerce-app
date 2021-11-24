# aws-serverless-eCommerce-app

## Tech stack
- Node.js
    - Express
- AWS
    - Lamda
        - Function: watch-inventory
    - DynamoDB
        - Table: watch-inventory
    - API Gateway
        - Stages: prod
        - API: inventory-api
    - Identity and Access Management (IAM)
        - Role: newInventory-role, associated with two policies
            - AmazonDynamoDBFullAccess
            - CloudWatchLogsFullAccess
    - CloudWatch 
    - CodePipeline
    - CodeDeploy
    - EC2, ec2-16-170-225-41.eu-north-1.compute.amazonaws.com:3000


- Postman, https://documenter.getpostman.com/view/17317918/UVJZoduC


## Functions


## Scripts

EC2 script on creation to install the CodeDeploy Agent:

```
#!/bin/bash
sudo yum -y update
sudo yum -y install ruby
sudo yum -y install wget
cd /home/ec2-user
wget https://aws-codedeploy-eu-north-1.s3.amazonaws.com/latest/install
sudo chmod +x ./install
sudo ./install auto
```