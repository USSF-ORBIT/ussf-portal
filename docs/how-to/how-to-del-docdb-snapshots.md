# How to delete DocumentDB Snapshots

We create manual snapshots of DocumentDB during a deploy. This ensures that if something during the deploy goes wrong, we have a restore point. AWS does not provide the ability to define or manage a lifecycle management policy for manual snapshots. AWS only allows 100 manual snapshots. This results in failures most commonly in our CI/CD pipeline that does more deploys to our AWS Dev environment and will eventually cause problems in CloudONE after we've performed 100 deploys.

An error returned in Github Actions job will say as much

```shell
An error occurred (SnapshotQuotaExceeded) when calling the CreateDBClusterSnapshot operation: Cannot create more than 100 manual snapshot
```

How to solve this is in an automated manner is a part of a bigger effort. In dev specifically because we do not care about loss of data, we can simply delete all of these snapshots. How it is currently done is with a small bash script that needs to be ran from the `spacecadets-dev-prod` directory in the `spacecadets-dev` repository. This would be similar to if you were going to try and login to AWS with `aws-vault`. The script is below

```shell
#!/bin/bash
# We use `dbss-$gitSHA` has an identifier for the snapshot. Automated snapshots do not use this convention so we know we can capture manual snapshots with this identifier
IDENTIFIER='dbss'
# Here we just use AWSCLI and jq to get the snapshot identifier which is necessary to pass to the command below
SNID=$(aws docdb describe-db-cluster-snapshots --db-cluster-identifier portal-client |jq -r '.DBClusterSnapshots[]' | jq -r '.DBClusterSnapshotIdentifier' |grep $IDENTIFIER)

for i in $SNID
do
    # The line below is nice if you want to see what exists
    echo $i
    # You can comment the line below out first, and the above line will show you the snapshots that will be deleted
    # This line does need to be uncommented as it is the command that does the deletion
    aws docdb delete-db-cluster-snapshot --db-cluster-snapshot-identifier $i
done
```

The `aws docdb delete-db-cluster-snapshot` command returns JSON output for every delete action. This is undesirable when you have 100 snapshots as you don't want to have to acknowledge the output of every individual delete action. So you can run the command like so `sh foo.sh &> out.log` if your script were named `foo.sh`. If you simply wanted to see the snapshot IDs without actually deleting anything, ensure `echo $i` line is uncommented, but the line beneath it _is_ commented, then simply run `sh foo.sh` and this will output the snapshot IDs.

```shell
sh foo.sh
Enter MFA code for arn:aws:iam::586397710337:mfa/bmorriso.org-root: 148492
dbss-61cd695f0230379d9af3ad9df33dad01562533f1
dbss-6a12ea3ae42948e0fc4c8acc7d7278b0041ee834
```

In CloudONE this script would need to be ran from the Jenkins instance. The script could either be typed out, or uploaded to Artifactory in Dev and then copied to the appropriate environment.
