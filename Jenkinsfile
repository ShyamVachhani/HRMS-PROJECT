pipeline {
    agent any

    environment {
        SONAR_PROJECT_KEY = 'hrms-frontend'
    }

    stages {

        stage('Checkout') {
            steps {
                deleteDir()
                checkout scm
            }
        }

        // stage('SonarQube Scan') {
        //     steps {
        //         withSonarQubeEnv('sonar-equest') {
        //             sh '''
        //                 docker run --rm \
        //                   -v "$PWD:/usr/src" \
        //                   -w /usr/src \
        //                   sonarsource/sonar-scanner-cli \
        //                   -Dsonar.projectKey=$SONAR_PROJECT_KEY \
        //                   -Dsonar.sources=.
        //             '''
        //         }
        //     }
        // }

        // stage('SonarQube Scan') {
        //     steps {
        //         withSonarQubeEnv('sonar-equest') {
        //             sh '''
        //                 docker run --rm \
        //                 -v "$PWD:/usr/src" \
        //                 -w /usr/src \
        //                 sonarsource/sonar-scanner-cli \
        //                 -Dsonar.projectKey=hrms-frontend \
        //                 -Dsonar.host.url=https://sonar.equest.solutions \
        //                 -Dsonar.token=$SONAR_TOKEN \
        //                 -Dsonar.sources=.
        //             '''
        //         }
        //     }
        // }

        // stage('SonarQube Scan') {
        //     steps {
        //         withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
        //             sh '''
        //                 docker run --rm \
        //                 -v "$PWD:/usr/src" \
        //                 -w /usr/src \
        //                 sonarsource/sonar-scanner-cli \
        //                 -Dsonar.projectKey=hrms-frontend \
        //                 -Dsonar.host.url=https://sonar.equest.solutions \
        //                 -Dsonar.token=$SONAR_TOKEN \
        //                 -Dsonar.sources=.
        //             '''
        //         }
        //     }
        // }

        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('sonar-equest') {
                    sh '''
                        sonar-scanner \
                        -Dsonar.projectKey=hrms-frontend \
                        -Dsonar.host.url=https://sonar.equest.solutions \
                        -Dsonar.sources=.
                    '''
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Build') {
            steps {
                sh '''
                    cd frontend-hrms
                    npm install
                    npm run build
                '''
            }
        }

        stage('Deploy to HRMS') {
            steps {
                sh '''
                    ssh user@hrms-server '
                        cd /var/www/node-apps/hrms/frontend-hrms &&
                        git pull &&
                        npm install &&
                        npm run build &&
                        pm2 restart eq-hrms
                    '
                '''
            }
        }
    }
}