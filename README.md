***** SETTING > CI/CD > Secret variables ******
/settings/ci_cd


Look at

HOST_LISTS_PRD
HOST_LISTS_STG
DOCKER_DEPLOY_KEY


This case we will use user "keang" for deploy at wwwdev2.local , easier due to this user already can user a docker

(ON PRODUCTION WE HAVE TO USE SEPERATED USER, FOR SECURITY REASON)

DOCKER DEPLOY KEY is id_rsa (generated from ssh-keygen)
id_rsa.pub is already added into /home/keang/.ssh/authorized_keys at wwwdev2 (pair of 'id_rsa' which generated from last keygen)




EDIT _node_deploy.yml , 

   registry_login_server: "git.pantip.com:4567"
    << NO NEED TO CHANGE EXCEPT WE MOVE THE GIT SERVER IP
   gitlab_docker_user: "pantip_stg_deployer" #this also have to change - must be a member in this project (better use a new user for deploy only)
   container_name: "{{ansible_nodename}}-server" #this also have to change to project name - DONT CHANGE "{{ansible_nodename}}-"
   registry_server: "git.pantip.com:4567/natee3g" #this also have to change to project root
   token: "q7mfCKaxXHf6SXnMXrCa" #this also have to change, get from https://docs.gitlab.com/ee/user/profile/personal_access_tokens.html (READ_REGISTRY ONLY)
   image_name: "server:{{ release_image_ver }}" #this also have to change , change only project name ( DONT EDIT :{{ release_image_ver }} )
 
 ports_mapping:
     
 - 3100:3100
    
 - [INSIDE]:[OUTSIDE]
  
volumes:
    
 - /var/log/docker_log/pantip-node_sample/:/var/log/nodejs/
   
 - [INSIDE]:[OUTSIDE]
   


EDIT _node_deploy.sh ONLY TWO LINE

#!/bin/bash
set -e

DESTINATION_HOST="www3g-stg" # <<< LOOK AT HOST_LISTS_STG , get value from first LINE
DESTINATION_USER="keang" # <<<< SSH TO DESTINATION USER
chmod 600 ./id_rsa
echo "deploying... $1"
ansible-playbook --key-file ./id_rsa -i _node_deploy_hosts.yml -u $DESTINATION_USER -e release_image_ver=$1 -e hostnames=$DESTINATION_HOST _node_deploy.yml
rm -f ./id_rsa
rm -f ./_node_deploy_hosts.yml







