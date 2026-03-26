.PHONY: backend frontend dev

backend:
	cd backend && uv sync && uv run app.py

frontend:
	cd frontend && npm run dev

dev:
	trap 'kill 0' INT TERM EXIT; \
	$(MAKE) --no-print-directory backend & \
	$(MAKE) --no-print-directory frontend & \
	wait
