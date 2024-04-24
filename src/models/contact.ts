import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, } from "typeorm";


export enum LinkPrecedence {
    PRIMARY = "primary",
    SECONDARY = "secondary"
}


@Entity()
class Contact {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true})
    email: string;

    @Column({ type: 'text', nullable: true})
    phoneNumber: string;

    @Column({ nullable: true})
    linkedId: number;

    @Column({ type: 'text' })
    linkPrecedence: LinkPrecedence

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn({ nullable: true})
    deletedAt: Date;

}

export default Contact