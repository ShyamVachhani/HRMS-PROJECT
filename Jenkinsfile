pipeline {
    agent { label 'hrms' }

    environment {
        SONAR_HOST_URL = 'https://sonar.equest.solutions/'
        SONAR_PROJECT_KEY = 'hrms-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('sonar-equest') {
                    dir('frontend-hrms') {
                        sh '''
                            /opt/sonar-scanner/bin/sonar-scanner \
                            -Dsonar.projectKey=hrms-frontend \
                            -Dsonar.sources=. \
                            -Dsonar.host.url=$SONAR_HOST_URL \
                            -Dsonar.login=$SONAR_AUTH_TOKEN
                        '''
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
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