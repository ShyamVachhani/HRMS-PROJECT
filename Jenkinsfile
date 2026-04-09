pipeline {
    agent { label 'hrms' }

    stages {
        stage('Deploy') {
            steps {
                dir('/var/www/node-apps/hrms/frontend-hrms') {
                    sh '''
                        git pull
                        su nodejs
                        npm run build
                        pm2 restart 31
                    '''
                }
            }
        }
    }
}
