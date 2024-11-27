package com.example.springbootappwithh2database.entity;

import java.time.Instant;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name ="chat_workflow")
@AllArgsConstructor
@NoArgsConstructor
@Data
public class ChatWorkFlow
{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Integer id ;
    private String content;
	private String contentType;
	private Integer chatType;
	private Integer parentId;
	private Instant createdDate;
	private Instant modifiedDate;
}
