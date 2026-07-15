// ==========================================================================
// Jenkinsfile — Pipeline CI/CD
// Bibliothèque Numérique Microservices — Tâche 5 (DevOps/CI-CD)
// Stack : Flask + React + MySQL + Docker
//
// Stages : Checkout -> Build -> Build images Docker -> Déploiement
//
// PRÉREQUIS si Jenkins tourne dans un conteneur Docker :
//   - Monter le socket Docker de l'hôte dans le conteneur Jenkins :
//       docker run -d --name jenkins \
//         -p 8080:8080 -p 50000:50000 \
//         -v /var/run/docker.sock:/var/run/docker.sock \
//         -v jenkins_home:/var/jenkins_home \
//         jenkins/jenkins:lts
//   - Installer le client Docker DANS l'image Jenkins.
//   - L'utilisateur Jenkins doit pouvoir exécuter docker (groupe "docker").
// ==========================================================================

// ==========================================================================
// Jenkinsfile — Pipeline CI/CD
// Bibliothèque Numérique Microservices — Tâche 5 (DevOps/CI-CD)
// Stack : Flask + FastAPI + React + PostgreSQL + Docker
// ==========================================================================

pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "bibliotheque"
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
                    echo "--- Vérification des services Flask/FastAPI ---"
                    ls services/livres/requirements.txt || echo "requirements.txt manquant dans livres"
                    ls services/utilisateurs/requirements.txt || echo "requirements.txt manquant dans utilisateurs"
                    ls services/emprunts/requirements.txt || echo "requirements.txt manquant dans emprunts"

                    echo "--- Vérification du Frontend React ---"
                    ls frontend/package.json || echo "package.json manquant dans le frontend"
                '''
            }
        }

        stage('Build images Docker') {
            steps {
                echo '🏗️ Construction locale des images via Docker Compose...'
                sh 'docker compose build'
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
            echo '✅ Pipeline exécuté avec succès : application déployée !'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifier les logs ci-dessus.'
        }
        always {
            sh 'docker compose ps'
        }
    }
}
