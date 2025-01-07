\c app_db

CREATE TABLE "_account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "_session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "_session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "_user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	CONSTRAINT "_user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "_verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "_board" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"members" text[] NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"public" boolean DEFAULT false NOT NULL,
	"description" text
);
--> statement-breakpoint
CREATE TABLE "_board_data" (
	"board_id" serial NOT NULL,
	"data" text
);
--> statement-breakpoint
CREATE TABLE "_invitation" (
	"board_id" serial NOT NULL,
	"from_id" text NOT NULL,
	"to_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"status" text DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "_account" ADD CONSTRAINT "_account_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_session" ADD CONSTRAINT "_session_user_id__user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_board_data" ADD CONSTRAINT "_board_data_board_id__board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."_board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_invitation" ADD CONSTRAINT "_invitation_board_id__board_id_fk" FOREIGN KEY ("board_id") REFERENCES "public"."_board"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_invitation" ADD CONSTRAINT "_invitation_from_id__user_id_fk" FOREIGN KEY ("from_id") REFERENCES "public"."_user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "_invitation" ADD CONSTRAINT "_invitation_to_id__user_id_fk" FOREIGN KEY ("to_id") REFERENCES "public"."_user"("id") ON DELETE no action ON UPDATE no action;
