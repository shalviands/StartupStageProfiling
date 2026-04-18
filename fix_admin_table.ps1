$file = 'src\app\admin\startups\page.tsx'
$lines = Get-Content $file -Encoding UTF8
# Line 130 (0-indexed: 129) is the duplicate <td> - remove it
$result = $lines[0..128] + $lines[130..($lines.Length-1)]
Set-Content $file $result -Encoding UTF8
Write-Host "Done. Total lines: $($result.Length)"
