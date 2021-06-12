import * as AWS from "aws-sdk";
let production: string= "prod";
let development: string= "dev";

export class CodeBuilder {
    async build(obj: any)
    {
        //In a project developer may add or remove or update a file so we should not re-build a project
        //which is already build before, so we are using a variable called processedProjects which will detect
        //the processed project and avoid re-build a project
        let processedProjects: string[] = new Array();
        if(obj.hasOwnProperty('commits')){
            console.log("ObJ: "+JSON.stringify(obj));
            const addedFiles = obj.commits[0].added;
            console.log("Response from git: "+JSON.stringify(obj));
            processedProjects = await this.buildByOperation(obj, addedFiles, processedProjects)
            const modifiedFiles = obj.commits[0].modified;
            processedProjects = await this.buildByOperation(obj, modifiedFiles, processedProjects)
            const removedFiles = obj.commits[0].removed;
            await this.buildByOperation(obj, removedFiles, processedProjects)
        }
        else {
            await this.processAllProjects(obj, processedProjects);
        }
    }

    //If there is no commits property in github request then process all the projects
    private async processAllProjects(obj: any, processedProjects: string[]): Promise<string[]>{
        const codeBuildProjectPaths = [
            'src/local-debug'
        ];
        processedProjects = await this.processBuild(obj, codeBuildProjectPaths, processedProjects);
        return processedProjects;
    }

    //Add or update or delete operation files will be passed in this method
    private async buildByOperation(obj: any, operationFiles: string[], processedProjects: string[]): Promise<string []> {
        for (let i = 0; i < operationFiles.length; i++) {
            const projectPath = operationFiles[i].split("/")
            processedProjects = await this.processBuild(obj, processedProjects, projectPath)
        }
        return processedProjects;
    }

    private async processBuild(obj: any, processedProjects: string[], projectPath: string[]): Promise<string []> {
        const sourceVersion = obj.ref;
        const ref = JSON.stringify(obj.ref).replace(/"/g, "");
        const branchPath = ref.split('/');
        const branch = branchPath[2];
        switch (projectPath[0]){
            case "src":
                processedProjects = await this.buildSrcProjects(projectPath, processedProjects, sourceVersion, branch);
                break;
        }

        return processedProjects;
    }
    
    private async buildSrcProjects(projectPath: string[], processedProjects: string[],
                                       sourceVersion: string, branch: string): Promise<string[]> {
        let appEnv= development;
        if(branch == "master")
        {
            appEnv= production;
        }
        await this.putParameter(appEnv);
        const project: string = `local-debug-codebuild-project-${appEnv}`;
        switch (projectPath[1]){
            case "local-debug":
                console.log(processedProjects);
                if(processedProjects.indexOf(project) < 0)
                {
                    await this.runBuild(project, sourceVersion, sourceVersion);
                    processedProjects.push(project);
                }
                break;
        }
        return processedProjects;
    }

    private async putParameter(parameterValue: string){
        var params = {
            Name: 'BUILDSPEC_ENV',
            Value: parameterValue,
            Overwrite: true,
            Type: 'String'
        };
        var ssm = new AWS.SSM({region: 'us-east-1'});
        await ssm.putParameter(params).promise();
    }

    //Actual codebuild starts here
    private async runBuild(projectName: string, sourceVersion: any, idempotencyToken: string):Promise<any> {
        const codebuild = new AWS.CodeBuild({
            region: "us-east-1",
        });
        const params = {
            projectName: projectName,
            artifactsOverride: {
                type: 'NO_ARTIFACTS',
            },
            cacheOverride: {
                type: 'NO_CACHE',
            },
            idempotencyToken,
            sourceVersion,
        };
        return  codebuild.startBuild(params).promise();
    }

}
