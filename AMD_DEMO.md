# AMD Demo — exact current 8004 product

The authoritative demo is the full running FastAPI application and private data snapshot, defaulting to the original ACL Knee Brace Session. It is NOT the public Crest C3 replay or a static-only website. Original application JS, CSS, CAD, APIs, navigation and report logic are copied without product redesign.

## Start the complete copy
Run START_AMD_ACL.ps1 -PrivateRoot <private-release-directory> -Python <compatible-python.exe>.
The private directory has separate data/, models/, originals/ and config/ folders. data/ contains a consistent full SQLite snapshot and all original runtime media. config/.env and config/.env.local are private and never committed. The wrapper prints the ACL URL including the original Session ID. Default port is 8008; original 8004 remains untouched.
All original Sessions including Crest C3 are retained. The launch wrapper requires the ACL Session and never substitutes a simulated record. Saved reports and feedback need no new inference. The ACL capture saved 1928 JPEG observations, not a continuous MP4; separately recorded original household MP4 files are retained in originals/ with their original provenance, not falsely attached to the ACL Session.

## Controlled online deployment — not yet provisioned
Deploy this same code with Python/FastAPI and a compatible preinstalled CPU/CUDA environment. Transfer the private data/models/originals separately to controlled storage; supply configuration through server environment or the private config directory. Keep data outside the web static root. Run one Uvicorn worker. Put the whole service, media routes and WebSocket routes behind an authenticated HTTPS gateway; do not expose the raw API or database directly. Domain, hosting target, authentication and access from the company network must be verified before calling the deployment complete.
No hosting target or credentials have been supplied for a full backend deployment. No existing site is overwritten. The previous raw.githack preview is a legacy static replay and is NOT the requested AMD complete product URL.

## Backup and rollback
Public Git branch stores code only. Private offline ZIP contains unchanged code, all database/media, models and original recordings. Credentials stay outside that ZIP and must be transferred securely if needed. To roll back, stop only the independent AMD service, unpack the private snapshot in a new directory and launch it against a fresh copy of data/. Preserve the prior directory; never reset or clean the original workspaces.