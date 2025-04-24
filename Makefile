.PHONY: setup-hooks

# Message handling functions
define echo-info
	@echo "\033[1;34m[INFO]\033[0m $(1)"
endef

define echo-success
	@echo "\033[1;32m[SUCCESS]\033[0m $(1)"
endef

define echo-error
	@echo "\033[1;31m[ERROR]\033[0m $(1)"
endef


# Setup hooks
setup-hooks:
	$(call echo-info, "Setting up hooks...")
	curl -s https://raw.githubusercontent.com/scoutredeem/scaffolding/refs/heads/main/ops/install-hooks.sh > install-hooks.sh
	chmod +x install-hooks.sh
	./install-hooks.sh
	$(call echo-success, "Hooks installed successfully")
	rm -f install-hooks.sh
	$(call echo-success, "Setup file cleaned up")
