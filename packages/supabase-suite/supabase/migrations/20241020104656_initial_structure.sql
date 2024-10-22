create type "public"."NotificationType" as enum ('MESSAGE', 'FRIENDREQUEST', 'JOIN_GROUP_REQUEST', 'INVITE_TO_GROUP_REQUEST');

create table "public"."ChatMessage" (
    "id" text not null,
    "senderId" text not null,
    "groupId" text not null,
    "sentAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "message" text not null
);


create table "public"."Comment" (
    "id" text not null,
    "content" text not null,
    "postId" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "authorId" text not null
);


create table "public"."Example" (
    "id" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."Group" (
    "id" text not null,
    "name" text not null,
    "image" text,
    "minAgeLimit" integer not null default 1,
    "maxAgeLimit" integer not null default 100,
    "size" integer not null default 50,
    "instantJoin" boolean not null default true
);


create table "public"."Notification" (
    "id" text not null,
    "type" "NotificationType" not null default 'MESSAGE'::"NotificationType",
    "message" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "receivingUserId" text not null,
    "sendingUserId" text,
    "groupId" text
);


create table "public"."Post" (
    "id" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null,
    "content" text not null,
    "image" text,
    "authorId" text not null,
    "groupId" text,
    "groupSize" integer
);


create table "public"."Tag" (
    "id" text not null,
    "name" text not null
);


create table "public"."UnreadMessage" (
    "id" text not null,
    "userId" text not null,
    "groupId" text not null,
    "unreadMessageCount" integer not null default 0
);


create table "public"."User" (
    "id" text not null,
    "name" text not null,
    "email" text not null,
    "image" text,
    "password" text not null,
    "dateOfBirth" timestamp(3) without time zone not null,
    "atTag" text not null,
    "description" text
);


create table "public"."UserGroups" (
    "id" text not null,
    "userId" text not null,
    "groupId" text not null
);


create table "public"."UserLikedPost" (
    "id" text not null,
    "userId" text not null,
    "postId" text not null,
    "createdAt" timestamp(3) without time zone not null default CURRENT_TIMESTAMP,
    "updatedAt" timestamp(3) without time zone not null
);


create table "public"."_GroupToUser" (
    "A" text not null,
    "B" text not null
);


create table "public"."_PostToTag" (
    "A" text not null,
    "B" text not null
);


create table "public"."_TagToUser" (
    "A" text not null,
    "B" text not null
);


create table "public"."_UserFriends" (
    "A" text not null,
    "B" text not null
);


create table "public"."_prisma_migrations" (
    "id" character varying(36) not null,
    "checksum" character varying(64) not null,
    "finished_at" timestamp with time zone,
    "migration_name" character varying(255) not null,
    "logs" text,
    "rolled_back_at" timestamp with time zone,
    "started_at" timestamp with time zone not null default now(),
    "applied_steps_count" integer not null default 0
);


CREATE UNIQUE INDEX "ChatMessage_pkey" ON public."ChatMessage" USING btree (id);

CREATE UNIQUE INDEX "Comment_pkey" ON public."Comment" USING btree (id);

CREATE UNIQUE INDEX "Example_pkey" ON public."Example" USING btree (id);

CREATE UNIQUE INDEX "Group_pkey" ON public."Group" USING btree (id);

CREATE UNIQUE INDEX "Notification_pkey" ON public."Notification" USING btree (id);

CREATE UNIQUE INDEX "Post_pkey" ON public."Post" USING btree (id);

CREATE UNIQUE INDEX "Tag_name_key" ON public."Tag" USING btree (name);

CREATE UNIQUE INDEX "Tag_pkey" ON public."Tag" USING btree (id);

CREATE UNIQUE INDEX "UnreadMessage_pkey" ON public."UnreadMessage" USING btree (id);

CREATE UNIQUE INDEX "UnreadMessage_userId_groupId_key" ON public."UnreadMessage" USING btree ("userId", "groupId");

CREATE UNIQUE INDEX "UserGroups_pkey" ON public."UserGroups" USING btree (id);

CREATE UNIQUE INDEX "UserLikedPost_pkey" ON public."UserLikedPost" USING btree (id);

CREATE UNIQUE INDEX "User_atTag_key" ON public."User" USING btree ("atTag");

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);

CREATE UNIQUE INDEX "User_pkey" ON public."User" USING btree (id);

CREATE UNIQUE INDEX "_GroupToUser_AB_unique" ON public."_GroupToUser" USING btree ("A", "B");

CREATE INDEX "_GroupToUser_B_index" ON public."_GroupToUser" USING btree ("B");

CREATE UNIQUE INDEX "_PostToTag_AB_unique" ON public."_PostToTag" USING btree ("A", "B");

CREATE INDEX "_PostToTag_B_index" ON public."_PostToTag" USING btree ("B");

CREATE UNIQUE INDEX "_TagToUser_AB_unique" ON public."_TagToUser" USING btree ("A", "B");

CREATE INDEX "_TagToUser_B_index" ON public."_TagToUser" USING btree ("B");

CREATE UNIQUE INDEX "_UserFriends_AB_unique" ON public."_UserFriends" USING btree ("A", "B");

CREATE INDEX "_UserFriends_B_index" ON public."_UserFriends" USING btree ("B");

CREATE UNIQUE INDEX _prisma_migrations_pkey ON public._prisma_migrations USING btree (id);

alter table "public"."ChatMessage" add constraint "ChatMessage_pkey" PRIMARY KEY using index "ChatMessage_pkey";

alter table "public"."Comment" add constraint "Comment_pkey" PRIMARY KEY using index "Comment_pkey";

alter table "public"."Example" add constraint "Example_pkey" PRIMARY KEY using index "Example_pkey";

alter table "public"."Group" add constraint "Group_pkey" PRIMARY KEY using index "Group_pkey";

alter table "public"."Notification" add constraint "Notification_pkey" PRIMARY KEY using index "Notification_pkey";

alter table "public"."Post" add constraint "Post_pkey" PRIMARY KEY using index "Post_pkey";

alter table "public"."Tag" add constraint "Tag_pkey" PRIMARY KEY using index "Tag_pkey";

alter table "public"."UnreadMessage" add constraint "UnreadMessage_pkey" PRIMARY KEY using index "UnreadMessage_pkey";

alter table "public"."User" add constraint "User_pkey" PRIMARY KEY using index "User_pkey";

alter table "public"."UserGroups" add constraint "UserGroups_pkey" PRIMARY KEY using index "UserGroups_pkey";

alter table "public"."UserLikedPost" add constraint "UserLikedPost_pkey" PRIMARY KEY using index "UserLikedPost_pkey";

alter table "public"."_prisma_migrations" add constraint "_prisma_migrations_pkey" PRIMARY KEY using index "_prisma_migrations_pkey";

alter table "public"."ChatMessage" add constraint "ChatMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ChatMessage" validate constraint "ChatMessage_groupId_fkey";

alter table "public"."ChatMessage" add constraint "ChatMessage_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."ChatMessage" validate constraint "ChatMessage_senderId_fkey";

alter table "public"."Comment" add constraint "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Comment" validate constraint "Comment_authorId_fkey";

alter table "public"."Comment" add constraint "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Comment" validate constraint "Comment_postId_fkey";

alter table "public"."Notification" add constraint "Notification_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Notification" validate constraint "Notification_groupId_fkey";

alter table "public"."Notification" add constraint "Notification_receivingUserId_fkey" FOREIGN KEY ("receivingUserId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Notification" validate constraint "Notification_receivingUserId_fkey";

alter table "public"."Notification" add constraint "Notification_sendingUserId_fkey" FOREIGN KEY ("sendingUserId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."Notification" validate constraint "Notification_sendingUserId_fkey";

alter table "public"."Post" add constraint "Post_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."Post" validate constraint "Post_authorId_fkey";

alter table "public"."UnreadMessage" add constraint "UnreadMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UnreadMessage" validate constraint "UnreadMessage_groupId_fkey";

alter table "public"."UnreadMessage" add constraint "UnreadMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UnreadMessage" validate constraint "UnreadMessage_userId_fkey";

alter table "public"."UserGroups" add constraint "UserGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UserGroups" validate constraint "UserGroups_groupId_fkey";

alter table "public"."UserGroups" add constraint "UserGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UserGroups" validate constraint "UserGroups_userId_fkey";

alter table "public"."UserLikedPost" add constraint "UserLikedPost_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UserLikedPost" validate constraint "UserLikedPost_postId_fkey";

alter table "public"."UserLikedPost" add constraint "UserLikedPost_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE RESTRICT not valid;

alter table "public"."UserLikedPost" validate constraint "UserLikedPost_userId_fkey";

alter table "public"."_GroupToUser" add constraint "_GroupToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_GroupToUser" validate constraint "_GroupToUser_A_fkey";

alter table "public"."_GroupToUser" add constraint "_GroupToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_GroupToUser" validate constraint "_GroupToUser_B_fkey";

alter table "public"."_PostToTag" add constraint "_PostToTag_A_fkey" FOREIGN KEY ("A") REFERENCES "Post"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_PostToTag" validate constraint "_PostToTag_A_fkey";

alter table "public"."_PostToTag" add constraint "_PostToTag_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_PostToTag" validate constraint "_PostToTag_B_fkey";

alter table "public"."_TagToUser" add constraint "_TagToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Tag"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_TagToUser" validate constraint "_TagToUser_A_fkey";

alter table "public"."_TagToUser" add constraint "_TagToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_TagToUser" validate constraint "_TagToUser_B_fkey";

alter table "public"."_UserFriends" add constraint "_UserFriends_A_fkey" FOREIGN KEY ("A") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_UserFriends" validate constraint "_UserFriends_A_fkey";

alter table "public"."_UserFriends" add constraint "_UserFriends_B_fkey" FOREIGN KEY ("B") REFERENCES "User"(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."_UserFriends" validate constraint "_UserFriends_B_fkey";

create policy "allow_all 1ffg0oo_0"
on "storage"."objects"
as permissive
for select
to public
using ((bucket_id = 'images'::text));


create policy "allow_all 1ffg0oo_1"
on "storage"."objects"
as permissive
for insert
to public
with check ((bucket_id = 'images'::text));


create policy "allow_all 1ffg0oo_2"
on "storage"."objects"
as permissive
for update
to public
using ((bucket_id = 'images'::text));


create policy "allow_all 1ffg0oo_3"
on "storage"."objects"
as permissive
for delete
to public
using ((bucket_id = 'images'::text));


