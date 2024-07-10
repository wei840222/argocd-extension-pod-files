# argocd-extensions-pod-files
An Argo CD extention to upload or download files from pod in Kubernetes.

https://github.com/wei840222/argocd-extensions-pod-files/assets/17737823/6317baf2-fc88-41e9-9b56-64bef5fd4898

## Usage

### Install ArgoCD Extensions Pod Files to Kubernetes cluster

[Helm](https://helm.sh) must be installed to use the charts.  Please refer to
Helm's [documentation](https://helm.sh/docs) to get started.

Once Helm has been set up correctly, add the repo as follows:
```sh
helm repo add argocd-extensions-pod-files https://wei840222.github.io/argocd-extensions-pod-files
helm repo update
```
If you had already added this repo earlier, run `helm repo update` to retrieve
the latest versions of the packages.  You can then run `helm search repo
<alias>` to see the charts.

To install the <chart-name> chart:
```sh
helm install argocd-extensions-pod-files argocd-extensions-pod-files/argocd-extensions-pod-files
```
To uninstall the chart:
```sh
helm delete argocd-extensions-pod-files
```
