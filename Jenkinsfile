pipeline {
    agent { label 'hrms' }

    // tools {
    //     sonarQubeScanner 'sonar-scanner'
    // }

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

        // stage('SonarQube Analysis') {
        //     steps {
        //         script {
        //             docker.image('sonarsource/sonar-scanner-cli:latest').inside {
        //                 sh """
        //                 sonar-scanner \
        //                 -Dsonar.projectKey=hrms-frontend \
        //                 -Dsonar.sources=frontend-hrms/src \
        //                 -Dsonar.host.url=https://sonar.equest.solutions \
        //                 -Dsonar.login=$SONAR_AUTH_TOKEN
        //                 """
        //             }
        //         }
        //     }
        // }

        // stage('SonarQube Analysis') {
        //     steps {
        //         withSonarQubeEnv('SonarQube') {
        //             sh '''
        //             docker run --rm \
        //                 -v $PWD:/usr/src \
        //                 -w /usr/src \
        //                 sonarsource/sonar-scanner-cli:latest \
        //                 sonar-scanner \
        //                 -Dsonar.projectKey=hrms-frontend \
        //                 -Dsonar.sources=frontend-hrms/src \
        //                 -Dsonar.host.url=$SONAR_HOST_URL \
        //                 -Dsonar.login=$SONAR_AUTH_TOKEN
        //             '''
        //         }
        //     }
        // }

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    sh '''
                        export PATH=$PATH:/usr/local/bin:/opt/sonar-scanner/bin
                        sonar-scanner \
                        -Dsonar.projectKey=hrms-frontend \
                        -Dsonar.sources=frontend-hrms/src \
                        -Dsonar.host.url=$SONAR_HOST_URL \
                        -Dsonar.login=$SONAR_AUTH_TOKEN
                    '''
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
