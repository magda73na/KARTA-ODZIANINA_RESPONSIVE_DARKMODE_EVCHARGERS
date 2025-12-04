CREATE EXTENSION IF NOT EXISTS "pg_graphql";
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "plpgsql";
CREATE EXTENSION IF NOT EXISTS "supabase_vault";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
--
-- PostgreSQL database dump
--


-- Dumped from database version 17.6
-- Dumped by pg_dump version 18.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--



SET default_table_access_method = heap;

--
-- Name: lottery_draws; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lottery_draws (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_id text NOT NULL,
    drawn_at timestamp with time zone DEFAULT now() NOT NULL,
    prize_id uuid
);


--
-- Name: lottery_prizes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.lottery_prizes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid,
    session_id text NOT NULL,
    name text NOT NULL,
    description text NOT NULL,
    type text NOT NULL,
    value integer NOT NULL,
    code text NOT NULL,
    partner text,
    won_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone NOT NULL,
    used boolean DEFAULT false NOT NULL,
    used_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT lottery_prizes_type_check CHECK ((type = ANY (ARRAY['percent'::text, 'voucher'::text, 'ticket'::text, 'other'::text])))
);


--
-- Name: lottery_draws lottery_draws_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_draws
    ADD CONSTRAINT lottery_draws_pkey PRIMARY KEY (id);


--
-- Name: lottery_draws lottery_draws_session_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_draws
    ADD CONSTRAINT lottery_draws_session_id_key UNIQUE (session_id);


--
-- Name: lottery_prizes lottery_prizes_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_prizes
    ADD CONSTRAINT lottery_prizes_code_key UNIQUE (code);


--
-- Name: lottery_prizes lottery_prizes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_prizes
    ADD CONSTRAINT lottery_prizes_pkey PRIMARY KEY (id);


--
-- Name: idx_lottery_draws_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lottery_draws_session_id ON public.lottery_draws USING btree (session_id);


--
-- Name: idx_lottery_draws_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lottery_draws_user_id ON public.lottery_draws USING btree (user_id);


--
-- Name: idx_lottery_prizes_session_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lottery_prizes_session_id ON public.lottery_prizes USING btree (session_id);


--
-- Name: idx_lottery_prizes_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_lottery_prizes_user_id ON public.lottery_prizes USING btree (user_id);


--
-- Name: lottery_draws lottery_draws_prize_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_draws
    ADD CONSTRAINT lottery_draws_prize_id_fkey FOREIGN KEY (prize_id) REFERENCES public.lottery_prizes(id) ON DELETE SET NULL;


--
-- Name: lottery_draws lottery_draws_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_draws
    ADD CONSTRAINT lottery_draws_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: lottery_prizes lottery_prizes_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.lottery_prizes
    ADD CONSTRAINT lottery_prizes_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: lottery_draws Users can insert their own draws; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own draws" ON public.lottery_draws FOR INSERT WITH CHECK ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_prizes Users can insert their own prizes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can insert their own prizes" ON public.lottery_prizes FOR INSERT WITH CHECK ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_draws Users can update their own draws; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own draws" ON public.lottery_draws FOR UPDATE USING ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_prizes Users can update their own prizes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own prizes" ON public.lottery_prizes FOR UPDATE USING ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_draws Users can view their own draws; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own draws" ON public.lottery_draws FOR SELECT USING ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_prizes Users can view their own prizes; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can view their own prizes" ON public.lottery_prizes FOR SELECT USING ((((auth.uid() IS NOT NULL) AND (user_id = auth.uid())) OR ((auth.uid() IS NULL) AND (session_id IS NOT NULL))));


--
-- Name: lottery_draws; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lottery_draws ENABLE ROW LEVEL SECURITY;

--
-- Name: lottery_prizes; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.lottery_prizes ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--


