node {
    def id_rsa = ''
    configFileProvider([configFile(fileId: "${params.ID_RSA_FILE}", variable: 'ID_RSA')]) {
        id_rsa = readFile(ID_RSA)
    }
    def env = ''
    configFileProvider([configFile(fileId: "${params.ENV_FILE}", variable: 'ENV')]) {
        env = readFile(ENV)
    }

    docker.withRegistry("${params.DOCKER_REGISTRY_URL}", "${params.DOCKER_REGISTRY_CREDENTIALS}") {

        git url: "${params.GIT_URL}", credentialsId: "${params.GIT_CREDENTIALS}"

        sh "git rev-parse HEAD > .git/commit-id"
        def commit_id = readFile('.git/commit-id').trim()
        println commit_id
        sh "rm -f .env.production"
        sh "echo \"${env}\" >> .env.production"

        stage "build"
        def app = docker.build "${params.IMAGE_NAME}", "--build-arg=id_rsa=\"${id_rsa}\" --no-cache --force-rm ."

        stage "publish"
        app.push 'latest'
    }
}