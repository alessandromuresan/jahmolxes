
function Main {

    # checkout gh-pages
    git checkout gh-pages

    # get the latest version
    git pull origin gh-pages

    # reset the last "Publish" commit
    git reset --hard HEAD~1

    # build the app for production
    npm run build:prod

    # remove everything we don't need
    Get-ChildItem -Exclude node_modules,Deploy-GithubPages.ps1,dist,.gitignore | Remove-Item -Force -Recurse

    # copy all items from the "dist" directory to the repo root
    Copy-DirectoryContents .\dist $PSScriptRoot

    # create a "Publish" commit
    git commit -m "Publish"

    # bite the pillow and force push
    git push --force origin gh-pages
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
