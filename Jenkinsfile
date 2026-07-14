// ==========================================================================
// Jenkinsfile — Pipeline CI/CD Évolué
// Bibliothèque Numérique Microservices — Tâche 5 (DevOps/CI-CD)
// Stack : Flask + React + PostgreSQL + Docker + Registry
// ==========================================================================

pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME  = "bibliotheque"
        
        // Identifiants pour le Registry (à configurer dans l'interface de Jenkins)
        DOCKER_REGISTRY_CREDS = 'docker-hub-credentials'
        DOCKER_USER           = 'ton_username_dockerhub' 
        REGISTRY_URL          = 'docker.io'
    }

    stages {

        stage('Checkout') {
            steps {
                echo '📥 Récupération du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Build & Test') {
            steps {
                echo '⚙️ Vérification des fichiers et des dépendances...'
                sh '''
                    echo "--- Vérification des services Flask ---"
                    ls services/livres/requirements.txt || echo "requirements.txt manquant dans livres"
                    ls services/utilisateurs/requirements.txt || echo "requirements.txt manquant dans utilisateurs"
                    ls services/emprunts/requirements.txt || echo "requirements.txt manquant dans emprunts"
                    
                    echo "--- Vérification du Frontend React ---"
                    ls frontend/package.json || echo "package.json manquant dans le frontend"
                '''
            }
        }

        stage('Build & Push images Docker') {
            steps {
                script {
                    echo '🏗️ Construction locale des images via Docker Compose...'
                    sh 'docker compose build'
                    
                    echo '🔐 Connexion au Docker Registry...'
                    withCredentials([usernamePassword(credentialsId: "${DOCKER_REGISTRY_CREDS}", usernameVariable: 'DOCKER_USER_VAR', passwordVariable: 'DOCKER_PASSWORD_VAR')]) {
                        sh "echo \$DOCKER_PASSWORD_VAR | docker login ${REGISTRY_URL} -u \$DOCKER_USER_VAR --password-stdin"
                    }

                    echo '🚀 Tag et Push des images vers le Registry...'
                    // On pousse les images construites pour pouvoir les partager ou les sauvegarder
                    sh "docker tag ${COMPOSE_PROJECT_NAME}-livres ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-livres:latest"
                    sh "docker tag ${COMPOSE_PROJECT_NAME}-utilisateurs ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-utilisateurs:latest"
                    sh "docker tag ${COMPOSE_PROJECT_NAME}-emprunts ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-emprunts:latest"
                    sh "docker tag ${COMPOSE_PROJECT_NAME}-frontend ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-frontend:latest"

                    sh "docker push ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-livres:latest"
                    sh "docker push ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-utilisateurs:latest"
                    sh "docker push ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-emprunts:latest"
                    sh "docker push ${DOCKER_USER}/${COMPOSE_PROJECT_NAME}-frontend:latest"
                }
            }
        }

        stage('Déploiement') {
            steps {
                echo '🚀 Déploiement automatique avec Docker Compose...'
                sh '''
                    docker compose down --remove-orphans
                    docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline exécuté avec succès : application déployée et images publiées !'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifier les logs ci-dessus.'
        }
        always {
            sh 'docker compose ps'
            echo '🧹 Déconnexion du Registry...'
            sh "docker logout ${REGISTRY_URL}"
        }
    }
}