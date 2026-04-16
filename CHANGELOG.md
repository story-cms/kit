# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed (breaking)

Renamed the **campaigns** CMS feature to **invitations** across types, backend, API, routes, Inertia pages, configuration, analytics, and UI copy.

#### Types and configuration (`@story-cms/kit` exports / `CmsConfig`)

- `CampaignMeta`, `CampaignStats`, `CampaignEditProps`, `CampaignBundle`, `CampaignItem`, `CampaignIndexProps`, `CampaignVersion`, `CampaignForApi` → `Invitation*` equivalents.
- `CampaignEditProps.campaign` → `invitation`; `CampaignIndexProps.campaigns` → `invitations`.
- `CmsConfig.campaigns` / `hasCampaigns` → `invitations` / `hasInvitations`.
- Consumer apps must update `defineConfig` / config stubs accordingly.

#### Backend

- Model `Campaign` → `Invitation` (default Lucid table name `invitations`).
- `CampaignService` → `InvitationService`; method names aligned (e.g. `getInvitationItems`, `getInvitationItemsForClient`, `getInvitationsForVersion`).
- `CampaignValidator` / `campaignErrorMessages` → `InvitationValidator` / `invitationErrorMessages`.
- `CampaignFactory` → `InvitationFactory`.
- Google Analytics Data API: `getCampaignStats` → `getInvitationStats`; custom event dimension `customEvent:campaign_id` → `customEvent:invitation_id` (update GA4 custom definitions and any clients sending the old parameter).

#### Routes and API (consuming Adonis apps)

- Web: `:locale/campaign/...` → `:locale/invitation/...` (create, edit, update, delete, index, stats).
- REST: `GET /api/v1/campaigns` → `GET /api/v1/invitations`; JSON body key `campaigns` → `invitations`.
- Controllers: `CampaignsController` / `campaigns_controller` → `InvitationsController` / `invitations_controller`.
- Analytics controller: `campaignStats` → `invitationStats`; cache key segment `campaignStats` → `invitationStats`.
- Stub/installer outputs (`configure`), migration stub identifier `campaigns` → `invitations` (new installs get an `invitations` table migration).

#### Frontend / Inertia

- Page component names: `CampaignsIndex` / `CampaignsEdit` → `InvitationsIndex` / `InvitationsEdit`.
- Kit exports: `CampaignsIndex` / `CampaignsEdit` → `InvitationsIndex` / `InvitationsEdit`.
- Shared helpers: `getCampaignStatus` → `getInvitationStatus`.
- Sidebar draft/nav flag: `include('campaign')` → `include('invitation')`; link `/…/campaign` → `/…/invitation`.
- Image upload preset in the edit form: `'campaigns'` → `'invitations'` (ensure Cloudinary upload preset exists if you rely on it).

#### Tests and stubs

- Stubs and generated tests under `src/backend/stubs/` use the new names and paths (e.g. `invitation_service.spec.ts`, `Invitation` in `model.stub`).

#### Migration notes for existing databases

- Apps with a `campaigns` table must run their own migration to rename the table to `invitations` (or equivalent) before relying on the `Invitation` model; new installs from stubs use `invitations` from the start.
