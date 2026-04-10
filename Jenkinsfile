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
                            sudo rm -rf dist
                            npm install --prefix /var/www/node-apps/hrms/frontend-hrms
                            npm run build --prefix /var/www/node-apps/hrms/frontend-hrms
                        '
                    '''
                }
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    withSonarQubeScanner('SonarScanner') {
                        sh '''
                            sonar-scanner \
                            -Dsonar.projectKey=hrms-frontend \
                            -Dsonar.sources=frontend-hrms/src
                        '''
                    }
                }
            }
        }

        stage('Quality Gate') {
            steps {
                waitForQualityGate abortPipeline: true
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
