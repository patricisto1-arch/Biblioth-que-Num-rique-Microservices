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

pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "bibliotheque"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Récupération du code depuis GitHub...'
                checkout scm
            }
        }

        stage('Build') {
            steps {
                echo 'Construction de l\'application (installation des dépendances)...'
                sh '''
                    echo "--- Backend Flask : Livres ---"
                    if [ -f services/livres/requirements.txt ]; then
                        pip install --break-system-packages -r services/livres/requirements.txt
                    fi

                    echo "--- Backend Flask : Utilisateurs ---"
                    if [ -f services/utilisateurs/requirements.txt ]; then
                        pip install --break-system-packages -r services/utilisateurs/requirements.txt
                    fi

                    echo "--- Backend Flask : Emprunts ---"
                    if [ -f services/emprunts/requirements.txt ]; then
                        pip install --break-system-packages -r services/emprunts/requirements.txt
                    fi

                    echo "--- Frontend React ---"
                    if [ -f frontend/package.json ]; then
                        cd frontend && npm install && cd ..
                    fi
                '''
            }
        }

        stage('Build images Docker') {
            steps {
                echo 'Construction des images Docker de chaque service...'
                sh 'docker compose build'
            }
        }

        stage('Déploiement') {
            steps {
                echo 'Déploiement automatique avec Docker Compose...'
                sh '''
                    docker compose down --remove-orphans
                    docker compose up -d
                '''
            }
        }
    }

    post {
        success {
            echo '✅ Pipeline exécuté avec succès : application déployée.'
        }
        failure {
            echo '❌ Le pipeline a échoué. Vérifier les logs ci-dessus.'
        }
        always {
            sh 'docker compose ps'
        }
    }
}
