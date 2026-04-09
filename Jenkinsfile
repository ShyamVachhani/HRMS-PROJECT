pipeline {
    agent { label 'hrms' }

    stages {
        stage('Deploy') {
            steps {
                dir('/var/www/node-apps/hrms/frontend-hrms') {
                    sh '''
                        git pull
                        sudo -u nodejs npm run build
                        sudo -u nodejs pm2 restart 31
                    '''
                }
            }
        }
    }
}
