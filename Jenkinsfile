pipeline {
    agent { label 'hrms' }

    stages {
        stage('Deploy') {
            steps {
                dir('/var/www/node-apps/hrms/frontend-hrms') {
                    sh '''
                        git pull
                        /home/nodejs/.nvm/versions/node/v22.16.0/bin/npm run build
                        /home/nodejs/.nvm/versions/node/v22.16.0/bin/pm2restart 31
                    '''
                }
            }
        }
    }
}
