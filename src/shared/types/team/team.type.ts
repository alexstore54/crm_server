import { Desk, Team } from '@prisma/client';

export type FullTeam = {
 team: Team;
 desk: Desk | null;
}