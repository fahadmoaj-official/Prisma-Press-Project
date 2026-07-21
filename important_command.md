for update prisma schema and apply changes to the database, you can use the following command:

 `npx prisma migrate dev`

for generating Prisma Client after updating the schema, you can use the following command:

`npx prisma generate`


when i do payment i mean hit this url (http://localhost:3000/api/subscription/checkout). 
i need to run this another terminal this command .beacuse when this server run they also give me detils (customer id ,subcriptin id etc..)and my code is cretated a entry on subcription table in my database.
`npm run stripe:webhook`


`stripe subscriptions cancel <subscription_id>`