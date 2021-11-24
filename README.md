# aws-serverless-eCommerce-app

## Tech stack
- Node.js
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
- Postman, https://documenter.getpostman.com/view/17317918/UVJZoduC


## Functions