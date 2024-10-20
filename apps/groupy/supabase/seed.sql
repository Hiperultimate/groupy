SET session_replication_role = replica;

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.1 (Ubuntu 15.1-1.pgdg20.04+1)
-- Dumped by pg_dump version 15.7 (Ubuntu 15.7-1.pgdg20.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: audit_log_entries; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: flow_state; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: users; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: identities; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: instances; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sessions; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_amr_claims; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_factors; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: mfa_challenges; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: one_time_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_providers; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: saml_relay_states; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: sso_domains; Type: TABLE DATA; Schema: auth; Owner: supabase_auth_admin
--



--
-- Data for Name: key; Type: TABLE DATA; Schema: pgsodium; Owner: supabase_admin
--



--
-- Data for Name: Group; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."User" ("id", "name", "email", "image", "password", "dateOfBirth", "atTag", "description") VALUES
	('cm2hhokkc0000mihgiv6p79ib', 'Global User', 'globalUser@gmail.com', NULL, '$2b$05$hKx.1ca6JhAI2.v7Z3sbVuD4XiyQ9YHyJ9toZ1FMxC3ilLpbFOSwO', '2024-10-01 00:00:00', 'globalUser', 'I am a global user!');


--
-- Data for Name: ChatMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Example; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Notification; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: Tag; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."Tag" ("id", "name") VALUES
	('5854a273-8267-4f54-afe3-ce8a506bc6d6', 'global'),
	('2ccae1f5-3daf-41b8-867b-ba7b6439edd5', 'user'),
	('25d7c9f1-72d5-45f2-887c-ca5ff174d1b7', 'time');


--
-- Data for Name: UnreadMessage; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: UserGroups; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: UserLikedPost; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _GroupToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _PostToTag; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _TagToUser; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO "public"."_TagToUser" ("A", "B") VALUES
	('5854a273-8267-4f54-afe3-ce8a506bc6d6', 'cm2hhokkc0000mihgiv6p79ib'),
	('2ccae1f5-3daf-41b8-867b-ba7b6439edd5', 'cm2hhokkc0000mihgiv6p79ib'),
	('25d7c9f1-72d5-45f2-887c-ca5ff174d1b7', 'cm2hhokkc0000mihgiv6p79ib');


--
-- Data for Name: _UserFriends; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: buckets; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: objects; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: s3_multipart_uploads_parts; Type: TABLE DATA; Schema: storage; Owner: supabase_storage_admin
--



--
-- Data for Name: hooks; Type: TABLE DATA; Schema: supabase_functions; Owner: supabase_functions_admin
--



--
-- Data for Name: secrets; Type: TABLE DATA; Schema: vault; Owner: supabase_admin
--



--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE SET; Schema: auth; Owner: supabase_auth_admin
--

SELECT pg_catalog.setval('"auth"."refresh_tokens_id_seq"', 1, false);


--
-- Name: key_key_id_seq; Type: SEQUENCE SET; Schema: pgsodium; Owner: supabase_admin
--

SELECT pg_catalog.setval('"pgsodium"."key_key_id_seq"', 1, false);


--
-- Name: hooks_id_seq; Type: SEQUENCE SET; Schema: supabase_functions; Owner: supabase_functions_admin
--

SELECT pg_catalog.setval('"supabase_functions"."hooks_id_seq"', 1, false);


--
-- PostgreSQL database dump complete
--

RESET ALL;
