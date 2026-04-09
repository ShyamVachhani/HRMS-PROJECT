pipeline {
    agent { label 'hrms' }

    stages {
        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('Build') {
            steps {
                dir('frontend-hrms') {
                    sh '''
                        sudo -u nodejs bash -c '
                            export NVM_DIR=/home/nodejs/.nvm
                            [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                            npm install --prefix /var/www/node-apps/hrms/frontend-hrms
                            npm run build --prefix /var/www/node-apps/hrms/frontend-hrms
                        '
                    '''
                }
            }
        }

        stage('Deploy') {
            steps {
                sh '''
                    sudo -u nodejs bash -c '
                        export NVM_DIR=/home/nodejs/.nvm
                        [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh"
                        pm2 restart eq-hrms
                    '
                '''
            }
        }
    }
}
