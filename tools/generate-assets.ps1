Add-Type -AssemblyName System.Drawing

$assetDir = Join-Path (Split-Path -Parent $PSScriptRoot) "assets"
New-Item -ItemType Directory -Force -Path $assetDir | Out-Null

function New-Canvas($width, $height, $path, $draw) {
  $bitmap = New-Object System.Drawing.Bitmap $width, $height
  $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
  $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
  $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
  & $draw $graphics $width $height
  $bitmap.Save($path, [System.Drawing.Imaging.ImageFormat]::Png)
  $graphics.Dispose()
  $bitmap.Dispose()
}

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml($hex))
}

function Pen($hex, $width = 1) {
  return New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml($hex)), $width
}

function Font($size, $style = [System.Drawing.FontStyle]::Bold) {
  return [System.Drawing.Font]::new("Arial", [float]$size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Draw-Background($g, $w, $h, $a, $b) {
  $rect = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush $rect, ([System.Drawing.ColorTranslator]::FromHtml($a)), ([System.Drawing.ColorTranslator]::FromHtml($b)), 35
  $g.FillRectangle($brush, $rect)
  $brush.Dispose()
  for ($i = 0; $i -lt 20; $i++) {
    $x = Get-Random -Minimum -40 -Maximum $w
    $y = Get-Random -Minimum -40 -Maximum $h
    $size = Get-Random -Minimum 18 -Maximum 82
    $color = [System.Drawing.Color]::FromArgb(45, 255, 255, 255)
    $g.FillEllipse((New-Object System.Drawing.SolidBrush $color), $x, $y, $size, $size)
  }
}

function Draw-Label($g, $text, $w, $h, $accent) {
  $font = Font 34
  $small = Font 17
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $g.DrawString($text, $font, (Brush "#ffffff"), (New-Object System.Drawing.RectangleF 24, ($h - 90), ($w - 48), 48), $format)
  $g.DrawString("LIVE UFO PRIZE", $small, (Brush $accent), (New-Object System.Drawing.RectangleF 24, ($h - 46), ($w - 48), 26), $format)
  $font.Dispose()
  $small.Dispose()
  $format.Dispose()
}

function Prize-Polar($g, $w, $h) {
  Draw-Background $g $w $h "#14224a" "#25f4a6"
  $g.FillEllipse((Brush "#f4fbff"), 84, 52, 252, 214)
  $g.FillEllipse((Brush "#dff2ff"), 58, 92, 80, 80)
  $g.FillEllipse((Brush "#dff2ff"), 282, 92, 80, 80)
  $g.FillEllipse((Brush "#141923"), 154, 130, 18, 18)
  $g.FillEllipse((Brush "#141923"), 248, 130, 18, 18)
  $g.FillEllipse((Brush "#5f6d85"), 198, 164, 34, 24)
  Draw-Label $g "Polar Mochi" $w $h "#071019"
}

function Prize-Mecha($g, $w, $h) {
  Draw-Background $g $w $h "#171a2b" "#ff4f8f"
  $pen = New-Object System.Drawing.Pen ([System.Drawing.Color]::White), 8
  $g.DrawPolygon($pen, @(
    [System.Drawing.Point]::new(210, 54),
    [System.Drawing.Point]::new(310, 154),
    [System.Drawing.Point]::new(260, 282),
    [System.Drawing.Point]::new(140, 282),
    [System.Drawing.Point]::new(92, 154)
  ))
  $g.FillRectangle((Brush "#25f4a6"), 134, 126, 152, 82)
  $g.FillRectangle((Brush "#071019"), 162, 150, 30, 22)
  $g.FillRectangle((Brush "#071019"), 226, 150, 30, 22)
  Draw-Label $g "Neon Mecha" $w $h "#25f4a6"
  $pen.Dispose()
}

function Prize-Cat($g, $w, $h) {
  Draw-Background $g $w $h "#451527" "#ff8bb5"
  $g.FillEllipse((Brush "#ffd2e2"), 82, 76, 260, 210)
  $g.FillPolygon((Brush "#ffd2e2"), @([System.Drawing.Point]::new(124, 92), [System.Drawing.Point]::new(158, 24), [System.Drawing.Point]::new(188, 102)))
  $g.FillPolygon((Brush "#ffd2e2"), @([System.Drawing.Point]::new(252, 102), [System.Drawing.Point]::new(286, 24), [System.Drawing.Point]::new(320, 92)))
  $g.FillEllipse((Brush "#201018"), 164, 150, 16, 16)
  $g.FillEllipse((Brush "#201018"), 244, 150, 16, 16)
  $g.FillEllipse((Brush "#ff4f8f"), 196, 176, 34, 22)
  Draw-Label $g "Strawberry Cat" $w $h "#ffffff"
}

function Prize-Capsule($g, $w, $h) {
  Draw-Background $g $w $h "#10141f" "#7a5cff"
  for ($i = 0; $i -lt 9; $i++) {
    $x = 70 + (($i % 3) * 92)
    $y = 56 + ([Math]::Floor($i / 3) * 74)
    $g.FillEllipse((Brush @("#25f4a6", "#ffbc3a", "#ff4f8f")[$i % 3]), $x, $y, 68, 68)
    $g.FillRectangle((Brush "#ffffff"), $x, ($y + 32), 68, 8)
  }
  Draw-Label $g "Capsule Lab" $w $h "#25f4a6"
}

function Prize-Rabbit($g, $w, $h) {
  Draw-Background $g $w $h "#09111f" "#3fc7ff"
  $g.FillEllipse((Brush "#ffffff"), 126, 86, 172, 182)
  $g.FillEllipse((Brush "#ffffff"), 120, 22, 48, 120)
  $g.FillEllipse((Brush "#ffffff"), 254, 22, 48, 120)
  $g.FillEllipse((Brush "#14224a"), 166, 154, 18, 18)
  $g.FillEllipse((Brush "#14224a"), 236, 154, 18, 18)
  $g.FillPolygon((Brush "#ff4f8f"), @([System.Drawing.Point]::new(202, 180), [System.Drawing.Point]::new(224, 180), [System.Drawing.Point]::new(213, 198)))
  Draw-Label $g "Crystal Rabbit" $w $h "#ffffff"
}

function Prize-Arcade($g, $w, $h) {
  Draw-Background $g $w $h "#0f1222" "#ffbc3a"
  $g.FillRectangle((Brush "#20283a"), 110, 46, 202, 260)
  $g.FillRectangle((Brush "#25f4a6"), 132, 76, 158, 92)
  $g.FillRectangle((Brush "#ff4f8f"), 132, 190, 158, 52)
  $g.FillEllipse((Brush "#ffbc3a"), 176, 204, 18, 18)
  $g.FillEllipse((Brush "#3fc7ff"), 222, 204, 18, 18)
  Draw-Label $g "Mini Arcade" $w $h "#ffffff"
}

function Prize-Ramen($g, $w, $h) {
  Draw-Background $g $w $h "#20130f" "#ff673a"
  for ($i = 0; $i -lt 4; $i++) {
    $g.FillRectangle((Brush "#ffbc3a"), (92 + $i * 42), (62 + $i * 38), 172, 88)
    $g.FillRectangle((Brush "#ffffff"), (108 + $i * 42), (84 + $i * 38), 140, 26)
  }
  Draw-Label $g "Ramen Tower" $w $h "#ffffff"
}

function Prize-Duck($g, $w, $h) {
  Draw-Background $g $w $h "#12242e" "#25f4a6"
  $g.FillEllipse((Brush "#ffe15a"), 90, 112, 138, 112)
  $g.FillEllipse((Brush "#ffe15a"), 206, 94, 120, 108)
  $g.FillPolygon((Brush "#ff8a24"), @([System.Drawing.Point]::new(304, 138), [System.Drawing.Point]::new(356, 154), [System.Drawing.Point]::new(304, 172)))
  $g.FillEllipse((Brush "#071019"), 260, 130, 14, 14)
  Draw-Label $g "Space Duck" $w $h "#071019"
}

$prizes = @(
  @("prize-polar.png", "Prize-Polar"),
  @("prize-mecha.png", "Prize-Mecha"),
  @("prize-cat.png", "Prize-Cat"),
  @("prize-capsule.png", "Prize-Capsule"),
  @("prize-rabbit.png", "Prize-Rabbit"),
  @("prize-arcade.png", "Prize-Arcade"),
  @("prize-ramen.png", "Prize-Ramen"),
  @("prize-duck.png", "Prize-Duck")
)

foreach ($item in $prizes) {
  New-Canvas 420 520 (Join-Path $assetDir $item[0]) (Get-Command $item[1]).ScriptBlock
}

$machineMap = @{
  "machine-polar.png" = "prize-polar.png";
  "machine-mecha.png" = "prize-mecha.png";
  "machine-cat.png" = "prize-cat.png";
  "machine-capsule.png" = "prize-capsule.png";
  "machine-rabbit.png" = "prize-rabbit.png";
  "machine-arcade.png" = "prize-arcade.png";
  "machine-ramen.png" = "prize-ramen.png";
  "machine-duck.png" = "prize-duck.png";
}

foreach ($entry in $machineMap.GetEnumerator()) {
  New-Canvas 1120 760 (Join-Path $assetDir $entry.Key) {
    param($g, $w, $h)
    Draw-Background $g $w $h "#080b12" "#171d2a"
    $g.FillRectangle((Brush "#e9f1ff"), 100, 84, 920, 560)
    $g.FillRectangle((Brush "#222a3a"), 128, 118, 864, 468)
    $g.FillRectangle((Brush "#d7e6ff"), 172, 154, 776, 330)
    $g.FillRectangle((Brush "#111827"), 172, 484, 776, 80)
    $g.FillRectangle((Brush "#25f4a6"), 418, 486, 284, 78)
    $g.FillRectangle((Brush "#ff4f8f"), 100, 644, 920, 42)
    $prize = [System.Drawing.Image]::FromFile((Join-Path $assetDir $entry.Value))
    $g.DrawImage($prize, 396, 184, 328, 300)
    $prize.Dispose()
    $g.FillRectangle((Brush "#cbd7e8"), 500, 78, 120, 40)
    $g.DrawLine((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"), 4)), 560, 118, 560, 240)
    $g.FillEllipse((Brush "#f4f7ff"), 532, 232, 56, 44)
  }
}

New-Canvas 1280 820 (Join-Path $assetDir "banner-crane.png") {
  param($g, $w, $h)
  Draw-Background $g $w $h "#08111f" "#20263a"
  $big = Font 88
  $mid = Font 34
  $small = Font 24
  $g.DrawString("UFO CRANE", $big, (Brush "#ffffff"), 72, 86)
  $g.DrawString("Online prize arcade", $mid, (Brush "#25f4a6"), 80, 186)
  $g.DrawString("LIVE QUEUE  -  TP PLAY  -  GUARANTEED WIN", $small, (Brush "#aab3c7"), 84, 246)
  $g.FillRectangle((Brush "#edf4ff"), 662, 86, 456, 560)
  $g.FillRectangle((Brush "#172033"), 692, 126, 396, 386)
  $g.FillRectangle((Brush "#ddecff"), 724, 164, 332, 250)
  $g.FillRectangle((Brush "#ff4f8f"), 724, 414, 332, 62)
  $g.FillRectangle((Brush "#25f4a6"), 850, 416, 110, 60)
  $g.FillEllipse((Brush "#ffe15a"), 798, 226, 128, 104)
  $g.FillEllipse((Brush "#ffd2e2"), 910, 218, 126, 112)
  $g.DrawLine((New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml("#ffffff"), 5)), 890, 126, 890, 226)
  $g.FillEllipse((Brush "#ffffff"), 858, 216, 64, 50)
  $g.DrawString("PLAY NOW", (Font 42), (Brush "#071019"), 782, 542)
  $big.Dispose()
  $mid.Dispose()
  $small.Dispose()
}
