# Amazon replacement remediation release

Build and package Affiliate locally with Node20. Pin the final archive SHA256/build ID in artifact.json after full local acceptance. Git push the accepted fixed source revision; the server pulls that revision and extracts this local runtime. No server build or dependency installation.

This controller updates only Affiliate. It preserves old static paths with hash-collision guards, checks existing commerce schema read-only and retired410 infrastructure, retargets both WorkingDirectory and ReadWritePaths, switches the existing current pointer, applies measured memory gates and arms an independent recovery timer. Failure restores the prior Affiliate unit and pointer.

After source/public acceptance and search notifications, inventory runtime/config/process/task references again for the existing current-plus-previous retention policy. Never replay earlier deletion manifests or database transactions.
