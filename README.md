# argocd-extensions-pod-files
An Argo CD extention to upload or download files from pod in Kubernetes.

https://github.com/user-attachments/assets/80476ef7-5a12-4180-9b51-9602721550e8

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
helm install -n <argocd namespace> argocd-extensions-pod-files argocd-extensions-pod-files/argocd-extensions-pod-files
```
To uninstall the chart:
```sh
helm delete -n <argocd namespace> argocd-extensions-pod-files
```

### Setup ArgoCD config
Assume you install ArgoCD by this [helm chart](https://github.com/argoproj/argo-helm/tree/main/charts/argo-cd).  
  
**Enable Argo CD extensions init container**  
https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/values.yaml#L1783
```yaml
## Argo CD extensions
## This function in tech preview stage, do expect instability or breaking changes in newer versions.
## Ref: https://github.com/argoproj-labs/argocd-extension-installer
## When you enable extensions, you need to configure RBAC of logged in Argo CD user.
## Ref: https://argo-cd.readthedocs.io/en/stable/operator-manual/rbac/#the-extensions-resource
extensions:
  # -- Enable support for Argo CD extensions
  enabled: true

  ...

  # -- Extensions for Argo CD
  # @default -- `[]` (See [values.yaml])
  ## Ref: https://github.com/argoproj-labs/argocd-extension-metrics#install-ui-extension
  extensionList:
    - name: extension-pod-files
        env:
          - name: EXTENSION_URL
            value: http://argocd-extensions-pod-files.<argocd namespace>/ui/extension.tar.gz
  
  ...
```

**Enable `server.enable.proxy.extension` and add `extension.config` like this [link](https://argo-cd.readthedocs.io/en/stable/developer-guide/extensions/proxy-extensions/#configuration)**  
https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/values.yaml#L228
```yaml
# Argo CD configuration parameters
## Ref: https://github.com/argoproj/argo-cd/blob/master/docs/operator-manual/argocd-cmd-params-cm.yaml
params:
  # -- Create the argocd-cmd-params-cm configmap
  # If false, it is expected the configmap will be created by something else.
  create: true

  ...

  # Enable the experimental proxy extension feature
  server.enable.proxy.extension: "true"

  ...
```
https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/values.yaml#L161
```yaml
## Argo Configs
configs:
  # General Argo CD configuration
  ## Ref: https://github.com/argoproj/argo-cd/blob/master/docs/operator-manual/argocd-cm.yaml
  cm:
    # -- Create the argocd-cm configmap for [declarative setup]
    create: true

    ...

    extension.config: |
      extensions:
        - name: pod-files
          backend:
            services:
              - url: http://argocd-extensions-pod-files.<argocd namespace>

    ...
```

**Grant permission for admin in `policy.csv`**
https://github.com/argoproj/argo-helm/blob/main/charts/argo-cd/values.yaml#L313
```yaml
# Argo CD RBAC policy configuration
## Ref: https://github.com/argoproj/argo-cd/blob/master/docs/operator-manual/rbac.md
rbac:
  # -- Create the argocd-rbac-cm configmap with ([Argo CD RBAC policy]) definitions.
  # If false, it is expected the configmap will be created by something else.
  # Argo CD will not work if there is no configmap created with the name above.
  create: true

  ...

  policy.csv: |
    p, role:admin, extensions, invoke, pod-files, allow

  ...
```
