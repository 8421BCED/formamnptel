# Regenerates the site icons from assets-src/java-logo-original.jpg. Only the cup and steam are used: the "Java"
# lettering would be unreadable at icon size.   Run:  powershell -ExecutionPolicy Bypass -File scripts\make-icons.ps1
Add-Type -AssemblyName System.Drawing
$root = Split-Path -Parent $PSScriptRoot
$source = [System.Drawing.Image]::FromFile((Join-Path $root 'assets-src\java-logo-original.jpg'))
$out = Join-Path $root 'public'

# Tight box around the cup + steam in the 736 x 736 original (stops above the "J" of the lettering, which starts ~y=486).
$cup = New-Object System.Drawing.Rectangle 228, 89, 278, 387

function New-Icon([int]$size, [string]$name, [double]$radiusFraction) {
  $bmp = New-Object System.Drawing.Bitmap $size, $size, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.SmoothingMode = 'AntiAlias'
  $g.InterpolationMode = 'HighQualityBicubic'
  $g.PixelOffsetMode = 'HighQuality'
  $g.Clear([System.Drawing.Color]::Transparent)
  if ($radiusFraction -gt 0) {
    $r = [int]($size * $radiusFraction); $d = $r * 2
    $path = New-Object System.Drawing.Drawing2D.GraphicsPath
    $path.AddArc(0, 0, $d, $d, 180, 90)
    $path.AddArc($size - $d, 0, $d, $d, 270, 90)
    $path.AddArc($size - $d, $size - $d, $d, $d, 0, 90)
    $path.AddArc(0, $size - $d, $d, $d, 90, 90)
    $path.CloseFigure()
    $g.SetClip($path)
  }
  $g.FillRectangle([System.Drawing.Brushes]::White, 0, 0, $size, $size)
  # cup centred, filling about 78% of the tile height
  $scale = ($size * 0.78) / $cup.Height
  $w = [int]($cup.Width * $scale); $h = [int]($cup.Height * $scale)
  $dest = New-Object System.Drawing.Rectangle ([int](($size - $w) / 2)), ([int](($size - $h) / 2)), $w, $h
  $g.DrawImage($source, $dest, $cup, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  $bmp.Save((Join-Path $out $name), [System.Drawing.Imaging.ImageFormat]::Png)
  $bmp.Dispose()
  "{0,-22} {1}x{1}" -f $name, $size
}

New-Icon 32  'favicon-32.png'        0.22
New-Icon 192 'icon-192.png'          0.22
New-Icon 512 'icon-512.png'          0.22
New-Icon 180 'apple-touch-icon.png'  0        # iOS rounds it itself and wants no transparency
New-Icon 128 'brand-mark.png'        0        # shown in the header, rounded there with CSS
$source.Dispose()
