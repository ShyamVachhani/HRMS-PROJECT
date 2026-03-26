# HRMS Project

```text
Setup:
    create .env files in both the folders,copy paste the .env.example file contents of both the folders in their seperate .env files
    in .env file in backend-hrms,set your database credentials(password,dbname,user and port) according to your database
    same for frontend-hrms's .env file set api url
    in terminal 1: 
        cd frontend-hrms
        npm install
        npm run dev
    and in terminal 2:
        cd backend-hrms
        npx sequelize-cli db:migrate
        npm install
        npm run dev
        
    thats it!
