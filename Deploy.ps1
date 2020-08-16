param(
    [string] $ResourceGroupName = "necro-dev-rg",
    [string] $WebAppName = "necro-dev-app",
    [string] $Folder = (Join-Path $PSScriptRoot "dist"),
    [string] $ZipPath = (Join-Path $PSScriptRoot "build.zip"),
    [switch] $NoLogin
)

Add-Type -Assembly System.IO.Compression.FileSystem
$CompressionLevel = [System.IO.Compression.CompressionLevel]::Optimal
[System.IO.Compression.ZipFile]::CreateFromDirectory($Folder, $ZipPath, $CompressionLevel, $false)

if (!$NoLogin) {
    az login | Write-Host
}

az webapp deployment source config-zip --resource-group $ResourceGroupName --name $WebAppName --src $ZipPath
