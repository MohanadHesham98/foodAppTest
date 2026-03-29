provider "aws" {
  region = "us-east-1"
}

# ---------------------------
# VPC
# ---------------------------
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"

  tags = {
    Name = "lab"
  }
}

# ---------------------------
# Internet Gateway
# ---------------------------
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "igw"
  }
}

# ---------------------------
# Public Subnet
# ---------------------------
resource "aws_subnet" "public" {
  vpc_id                  = aws_vpc.main.id
  cidr_block              = "10.0.1.0/24"
  map_public_ip_on_launch = true

  tags = {
    Name = "public"
  }
}

# ---------------------------
# Private Subnet
# ---------------------------
resource "aws_subnet" "private" {
  vpc_id     = aws_vpc.main.id
  cidr_block = "10.0.2.0/24"

  tags = {
    Name = "private"
  }
}

# ---------------------------
# Elastic IP for NAT
# ---------------------------
resource "aws_eip" "nat_eip" {
  domain = "vpc"
}

# ---------------------------
# NAT Gateway
# ---------------------------
resource "aws_nat_gateway" "nat" {
  allocation_id = aws_eip.nat_eip.id
  subnet_id     = aws_subnet.public.id

  tags = {
    Name = "ngw"
  }

  depends_on = [aws_internet_gateway.igw]
}

# ---------------------------
# Route Table - Public
# ---------------------------
resource "aws_route_table" "public_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "public"
  }
}

resource "aws_route_table_association" "public_assoc" {
  subnet_id      = aws_subnet.public.id
  route_table_id = aws_route_table.public_rt.id
}

# ---------------------------
# Route Table - Private
# ---------------------------
resource "aws_route_table" "private_rt" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.nat.id
  }

  tags = {
    Name = "private"
  }
}

resource "aws_route_table_association" "private_assoc" {
  subnet_id      = aws_subnet.private.id
  route_table_id = aws_route_table.private_rt.id
}

# ---------------------------
# Security Group
# ---------------------------
resource "aws_security_group" "food_sg" {
  name        = "foodapp-sg"
  description = "Allow SSH, K3s, NodePort"
  vpc_id      = aws_vpc.main.id

  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"] 
  }

  ingress {
    description = "K3s API"
    from_port   = 6443
    to_port     = 6443
    protocol    = "tcp"
    cidr_blocks = ["10.0.0.0/16"]
  }

  ingress {
    description = "NodePort"
    from_port   = 30000
    to_port     = 32767
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Internal"
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["10.0.0.0/16"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ---------------------------
# EC2 Instances
# ---------------------------

variable "ami_id" {
  default = "ami-0c02fb55956c7d316" # Ubuntu (update if needed)
}

variable "instance_type" {
  default = "t3.small"
}

variable "key_name" {
  description = "EC2 Key Pair name"
}

# Master Node
resource "aws_instance" "master" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.food_sg.id]
  key_name               = var.key_name

  tags = {
    Name = "master"
  }
}

# Worker01 (Public)
resource "aws_instance" "worker01" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.public.id
  vpc_security_group_ids = [aws_security_group.food_sg.id]
  key_name               = var.key_name

  tags = {
    Name = "worker01"
  }
}

# Worker02 (Private)
resource "aws_instance" "worker02" {
  ami                    = var.ami_id
  instance_type          = var.instance_type
  subnet_id              = aws_subnet.private.id
  vpc_security_group_ids = [aws_security_group.food_sg.id]
  key_name               = var.key_name

  tags = {
    Name = "worker02"
  }
}
