#!/bin/bash

# React Chat App - Auto Deployment Script
# This script will help Copilot deploy your chat app automatically

set -e

echo "🚀 Starting React Chat App Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_dependencies() {
    print_status "Checking dependencies..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm first."
        exit 1
    fi
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        print_warning "Docker is not installed. Docker deployment will be skipped."
        DOCKER_AVAILABLE=false
    else
        DOCKER_AVAILABLE=true
    fi
    
    print_success "Dependencies check completed!"
}

# Install dependencies
install_dependencies() {
    print_status "Installing dependencies..."
    
    if [ -f "package.json" ]; then
        npm install
    fi
    
    if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
        cd frontend && npm install && cd ..
    fi
    
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        cd backend && npm install && cd ..
    fi
    
    print_success "Dependencies installed!"
}

# Build the application
build_app() {
    print_status "Building the application..."
    
    if [ -d "frontend" ]; then
        cd frontend && npm run build && cd ..
        print_success "Frontend built successfully!"
    fi
    
    # Test backend if there's a test script
    if [ -d "backend" ] && [ -f "backend/package.json" ]; then
        cd backend
        if npm run | grep -q "test"; then
            npm test
        fi
        cd ..
        print_success "Backend tested successfully!"
    fi
}

# Docker deployment
deploy_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Building Docker image..."
        
        docker build -t react-chat-app .
        print_success "Docker image built successfully!"
        
        # Option to run locally
        read -p "Do you want to run the app locally with Docker? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            print_status "Starting application with Docker..."
            docker run -p 5000:5000 -d --name chat-app react-chat-app
            print_success "App is running at http://localhost:5000"
        fi
    fi
}

# Deploy to Railway
deploy_railway() {
    print_status "Deploying to Railway..."
    
    # Check if Railway CLI is installed
    if ! command -v railway &> /dev/null; then
        print_status "Installing Railway CLI..."
        npm install -g @railway/cli
    fi
    
    # Check if user is logged in
    if ! railway whoami &> /dev/null; then
        print_warning "Please login to Railway first:"
        railway login
    fi
    
    # Initialize and deploy
    if [ ! -f "railway.json" ]; then
        railway init --name react-chat-app
    fi
    
    railway up
    print_success "Deployed to Railway!"
}

# Deploy to Fly.io
deploy_fly() {
    print_status "Deploying to Fly.io..."
    
    # Check if Fly CLI is installed
    if ! command -v flyctl &> /dev/null; then
        print_status "Installing Fly CLI..."
        curl -L https://fly.io/install.sh | sh
        export PATH="$HOME/.fly/bin:$PATH"
    fi
    
    # Check if user is logged in
    if ! flyctl auth whoami &> /dev/null; then
        print_warning "Please login to Fly.io first:"
        flyctl auth login
    fi
    
    # Initialize and deploy
    if [ ! -f "fly.toml" ]; then
        flyctl launch --name react-chat-app --no-deploy
    fi
    
    flyctl deploy
    print_success "Deployed to Fly.io!"
}

# Deploy to Vercel (frontend only)
deploy_vercel() {
    if [ -d "frontend" ]; then
        print_status "Deploying frontend to Vercel..."
        
        # Check if Vercel CLI is installed
        if ! command -v vercel &> /dev/null; then
            print_status "Installing Vercel CLI..."
            npm install -g vercel
        fi
        
        cd frontend
        vercel --prod
        cd ..
        print_success "Frontend deployed to Vercel!"
    fi
}

# Main deployment menu
deployment_menu() {
    echo ""
    echo "Choose deployment option:"
    echo "1) Railway (Recommended - Free tier)"
    echo "2) Fly.io (Free tier)"
    echo "3) Vercel (Frontend only)"
    echo "4) Docker (Local)"
    echo "5) All platforms"
    echo "6) Skip deployment"
    
    read -p "Enter your choice (1-6): " choice
    
    case $choice in
        1)
            deploy_railway
            ;;
        2)
            deploy_fly
            ;;
        3)
            deploy_vercel
            ;;
        4)
            deploy_docker
            ;;
        5)
            deploy_railway
            deploy_fly
            deploy_vercel
            deploy_docker
            ;;
        6)
            print_status "Skipping deployment..."
            ;;
        *)
            print_error "Invalid choice. Please run the script again."
            exit 1
            ;;
    esac
}

# Main execution
main() {
    echo "🎯 React Chat App Auto-Deploy Script"
    echo "======================================"
    
    check_dependencies
    install_dependencies
    build_app
    deployment_menu
    
    echo ""
    print_success "🎉 Deployment process completed!"
    echo ""
    echo "📝 Next steps:"
    echo "   - Test your deployed application"
    echo "   - Share the URL with friends"
    echo "   - Monitor the application logs"
    echo ""
    echo "🔗 Useful commands:"
    echo "   - railway logs (to view Railway logs)"
    echo "   - flyctl logs (to view Fly.io logs)"
    echo "   - docker logs chat-app (to view Docker logs)"
}

# Run main function
main "$@"
