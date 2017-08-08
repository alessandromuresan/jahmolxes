
function Main {

    # build the app for production
    npm run build:prod

    # remove everything we don't need
    Get-ChildItem -Exclude node_modules,Deploy-GithubPages.ps1,dist,.gitignore | Remove-Item -Force -Recurse

    # copy all items from the "dist" directory to the repo root
    Copy-DirectoryContents .\dist $PSScriptRoot
}

function Copy-DirectoryContents($from, $to) {

    $exclude = @("main.js")
    $excludeMatch = @("app")

    Get-ChildItem -Path $from -Recurse -Exclude $exclude | 
          where { $excludeMatch -eq $null -or $_.FullName.Replace($from, "") -notmatch $excludeMatch } |
          Copy-Item -Destination {
            if ($_.PSIsContainer) {
              Join-Path $to $_.Parent.FullName.Substring($from.length)
            } else {
              Join-Path $to $_.FullName.Substring($from.length)
            }
           } -Force -Exclude $exclude
}

Main
